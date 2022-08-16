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
import { queryKeys } from ".";

import { FactcheckPost, FactcheckPatch, Debate } from "../../types";

//*- 팩트페크 생성
export const usePostFactcheck = (
  debateId: number,
  options?: UseMutationOptions<FactcheckPost, AxiosError, FactcheckPost>,
): UseMutationResult<FactcheckPost, AxiosError, FactcheckPost> => {
  const queryClient = useQueryClient();
  return useMutation((factcheckPost) => postFactcheck(factcheckPost), {
    ...options,
    onSuccess: () => {
      queryClient.invalidateQueries([queryKeys.debates, `${debateId}`]);
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(
        `${err.response?.data?.message || "네트워크 에러가 발생했습니다."}`,
      );
    },
  });
};

//*- 팩트페크 수정
export const usePatchFactcheck = (
  debateId: number,
  options?: UseMutationOptions<FactcheckPatch, AxiosError, FactcheckPatch>,
): UseMutationResult<FactcheckPatch, AxiosError, FactcheckPatch> => {
  const queryClient = useQueryClient();
  return useMutation((factcheckPatch) => patchFactcheck(factcheckPatch), {
    ...options,
    onMutate: (factcheckPatch) => {
      const prevDebate: Debate | undefined = queryClient.getQueryData([
        queryKeys.debates,
        `${debateId}`,
      ]);
      if (prevDebate !== undefined) {
        queryClient.cancelQueries([queryKeys.debates, `${debateId}`]);
        queryClient.setQueryData([queryKeys.debates, `${debateId}`], () => {
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
            [queryKeys.debates, `${debateId}`],
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

//*- 팩트페크 삭제
export const useDeleteFactcheck = (
  debateId: number,
  options?: UseMutationOptions<number, AxiosError, number>,
): UseMutationResult<number, AxiosError, number> => {
  const queryClient = useQueryClient();
  return useMutation((factcheckId) => deleteFactcheck(factcheckId), {
    ...options,
    onMutate: (factcheckId) => {
      const prevDebate: Debate | undefined = queryClient.getQueryData([
        queryKeys.debates,
        `${debateId}`,
      ]);
      if (prevDebate !== undefined) {
        queryClient.cancelQueries([queryKeys.debates, `${debateId}`]);
        queryClient.setQueryData([queryKeys.debates, `${debateId}`], () => {
          return {
            ...prevDebate,
            factchecks: prevDebate.factchecks.filter(
              (factcheck) => factcheck.id !== factcheckId,
            ),
          };
        });
        return () => {
          queryClient.setQueryData(
            [queryKeys.debates, `${debateId}`],
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
