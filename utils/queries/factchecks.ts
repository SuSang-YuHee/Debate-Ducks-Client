import { AxiosError } from "axios";
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from "react-query";
import { Dispatch, SetStateAction } from "react";

import {
  postFactcheck,
  patchFactcheck,
  deleteFactcheck,
} from "../../api/factchecks";

import { FactcheckPost, FactcheckPatch, Debate } from "../../types";

export const usePostFactcheck = (
  debateId: number,
  setIsErrorModalOn: Dispatch<SetStateAction<boolean>>,
  options?: UseMutationOptions<FactcheckPost, AxiosError, FactcheckPost>,
): UseMutationResult<FactcheckPost, AxiosError, FactcheckPost> => {
  const queryClient = useQueryClient();
  return useMutation((factcheckPost) => postFactcheck(factcheckPost), {
    ...options,
    onSuccess: () => {
      queryClient.invalidateQueries(["debates", `${debateId}`]);
    },
    onError: () => {
      setIsErrorModalOn(true);
    },
  });
};

export const usePatchFactcheck = (
  debateId: number,
  setIsErrorModalOn: Dispatch<SetStateAction<boolean>>,
  options?: UseMutationOptions<FactcheckPatch, AxiosError, FactcheckPatch>,
): UseMutationResult<FactcheckPatch, AxiosError, FactcheckPatch> => {
  const queryClient = useQueryClient();
  return useMutation((factcheckPatch) => patchFactcheck(factcheckPatch), {
    ...options,
    onMutate: (factcheckPatch) => {
      const prevDebate: Debate | undefined = queryClient.getQueryData([
        "debates",
        `${debateId}`,
      ]);
      if (prevDebate !== undefined) {
        queryClient.cancelQueries(["debates", `${debateId}`]);
        queryClient.setQueryData(["debates", `${debateId}`], () => {
          return {
            ...prevDebate,
            factchecks: prevDebate.factchecks.map((factcheck) => {
              if (factcheck.id === factcheckPatch.id) {
                return {
                  ...factcheck,
                  description: factcheckPatch.description,
                  reference_url: factcheckPatch.reference_url,
                };
              }
              return factcheck;
            }),
          };
        });
        return () => {
          queryClient.setQueryData(["debates", `${debateId}`], prevDebate);
        };
      }
    },
    onError: (error, variables, rollback) => {
      if (rollback) rollback();
      setIsErrorModalOn(true);
    },
  });
};

export const useDeleteFactcheck = (
  debateId: number,
  setIsErrorModalOn: Dispatch<SetStateAction<boolean>>,
  options?: UseMutationOptions<number, AxiosError, number>,
): UseMutationResult<number, AxiosError, number> => {
  const queryClient = useQueryClient();
  return useMutation((factcheckId) => deleteFactcheck(factcheckId), {
    ...options,
    onMutate: (factcheckId) => {
      const prevDebate: Debate | undefined = queryClient.getQueryData([
        "debates",
        `${debateId}`,
      ]);
      if (prevDebate !== undefined) {
        queryClient.cancelQueries(["debates", `${debateId}`]);
        queryClient.setQueryData(["debates", `${debateId}`], () => {
          return {
            ...prevDebate,
            factchecks: prevDebate.factchecks.filter(
              (factcheck) => factcheck.id !== factcheckId,
            ),
          };
        });
        return () => {
          queryClient.setQueryData(["debates", `${debateId}`], prevDebate);
        };
      }
    },
    onError: (error, variables, rollback) => {
      if (rollback) rollback();
      setIsErrorModalOn(true);
    },
  });
};
