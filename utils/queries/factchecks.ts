import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from "react-query";

import {
  postFactcheck,
  patchFactcheck,
  deleteFactcheck,
} from "../../api/factchecks";
import { queryStr } from ".";

import { FactcheckPost, FactcheckPatch, Debate } from "../../types";

export const usePostFactcheck = (
  debateId: number,
  options?: UseMutationOptions<FactcheckPost, AxiosError, FactcheckPost>,
): UseMutationResult<FactcheckPost, AxiosError, FactcheckPost> => {
  const queryClient = useQueryClient();
  return useMutation((factcheckPost) => postFactcheck(factcheckPost), {
    ...options,
    onSuccess: () => {
      queryClient.invalidateQueries([queryStr.debates, `${debateId}`]);
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(
        `${err.response?.data?.message || "네트워크 에러가 발생했습니다."}`,
      );
    },
  });
};

export const usePatchFactcheck = (
  debateId: number,
  options?: UseMutationOptions<FactcheckPatch, AxiosError, FactcheckPatch>,
): UseMutationResult<FactcheckPatch, AxiosError, FactcheckPatch> => {
  const queryClient = useQueryClient();
  return useMutation((factcheckPatch) => patchFactcheck(factcheckPatch), {
    ...options,
    onMutate: (factcheckPatch) => {
      const prevDebate: Debate | undefined = queryClient.getQueryData([
        queryStr.debates,
        `${debateId}`,
      ]);
      if (prevDebate !== undefined) {
        queryClient.cancelQueries([queryStr.debates, `${debateId}`]);
        queryClient.setQueryData([queryStr.debates, `${debateId}`], () => {
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
          queryClient.setQueryData(
            [queryStr.debates, `${debateId}`],
            prevDebate,
          );
        };
      }
    },
    onError: (
      err: AxiosError<{ message: string }>,
      _,
      rollback: (() => void) | undefined,
    ) => {
      if (rollback) rollback();
      toast.error(
        `${err.response?.data?.message || "네트워크 에러가 발생했습니다."}`,
      );
    },
  });
};

export const useDeleteFactcheck = (
  debateId: number,
  options?: UseMutationOptions<number, AxiosError, number>,
): UseMutationResult<number, AxiosError, number> => {
  const queryClient = useQueryClient();
  return useMutation((factcheckId) => deleteFactcheck(factcheckId), {
    ...options,
    onMutate: (factcheckId) => {
      const prevDebate: Debate | undefined = queryClient.getQueryData([
        queryStr.debates,
        `${debateId}`,
      ]);
      if (prevDebate !== undefined) {
        queryClient.cancelQueries([queryStr.debates, `${debateId}`]);
        queryClient.setQueryData([queryStr.debates, `${debateId}`], () => {
          return {
            ...prevDebate,
            factchecks: prevDebate.factchecks.filter(
              (factcheck) => factcheck.id !== factcheckId,
            ),
          };
        });
        return () => {
          queryClient.setQueryData(
            [queryStr.debates, `${debateId}`],
            prevDebate,
          );
        };
      }
    },
    onError: (
      err: AxiosError<{ message: string }>,
      _,
      rollback: (() => void) | undefined,
    ) => {
      if (rollback) rollback();
      toast.error(
        `${err.response?.data?.message || "네트워크 에러가 발생했습니다."}`,
      );
    },
  });
};
