import { AxiosError } from "axios";
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "react-query";
import { Dispatch, SetStateAction } from "react";

import { getHeart, postHeart, deleteHeart } from "../../api/hearts";

import { Debate, HeartPatchOrDelete } from "../../types";

export const useGetHeart = (
  debateId: number,
  userId: string,
  options?: UseQueryOptions<boolean, AxiosError>,
) => {
  const query = useQuery<boolean, AxiosError>(
    ["hearts", `${debateId}`],
    () => getHeart(debateId, userId),
    options,
  );
  return query;
};

export const usePostHeart = (
  setIsErrorModalOn: Dispatch<SetStateAction<boolean>>,
  options?: UseMutationOptions<
    HeartPatchOrDelete,
    AxiosError,
    HeartPatchOrDelete
  >,
): UseMutationResult<HeartPatchOrDelete, AxiosError, HeartPatchOrDelete> => {
  const queryClient = useQueryClient();
  return useMutation(({ debateId, userId }) => postHeart(debateId, userId), {
    ...options,
    onMutate: (heart) => {
      const prevHeart: boolean | undefined = queryClient.getQueryData([
        "hearts",
        `${heart.debateId}`,
      ]);
      const prevDebate: Debate | undefined = queryClient.getQueryData([
        "debates",
        `${heart.debateId}`,
      ]);
      if (prevHeart !== undefined && prevDebate !== undefined) {
        queryClient.cancelQueries(["hearts", `${heart.debateId}`]);
        queryClient.cancelQueries(["debates", `${heart.debateId}`]);
        queryClient.setQueryData(["hearts", `${heart.debateId}`], () => {
          return !prevHeart;
        });
        queryClient.setQueryData(["debates", `${heart.debateId}`], () => {
          return {
            ...prevDebate,
            heartCnt: prevDebate.heartCnt + 1,
          };
        });
        return () => {
          queryClient.setQueryData(["hearts", `${heart.debateId}`], prevHeart);
          queryClient.setQueryData(
            ["debates", `${heart.debateId}`],
            prevDebate,
          );
        };
      }
    },
    onError: (error, variables, rollback) => {
      if (rollback) rollback();
      setIsErrorModalOn(true);
    },
  });
};

export const useDeleteHeart = (
  setIsErrorModalOn: Dispatch<SetStateAction<boolean>>,
  options?: UseMutationOptions<
    HeartPatchOrDelete,
    AxiosError,
    HeartPatchOrDelete
  >,
): UseMutationResult<HeartPatchOrDelete, AxiosError, HeartPatchOrDelete> => {
  const queryClient = useQueryClient();
  return useMutation(({ debateId, userId }) => deleteHeart(debateId, userId), {
    ...options,
    onMutate: (heart) => {
      const prevHeart: boolean | undefined = queryClient.getQueryData([
        "hearts",
        `${heart.debateId}`,
      ]);
      const prevDebate: Debate | undefined = queryClient.getQueryData([
        "debates",
        `${heart.debateId}`,
      ]);
      if (prevHeart !== undefined && prevDebate !== undefined) {
        queryClient.cancelQueries(["hearts", `${heart.debateId}`]);
        queryClient.cancelQueries(["debates", `${heart.debateId}`]);
        queryClient.setQueryData(["hearts", `${heart.debateId}`], () => {
          return !prevHeart;
        });
        queryClient.setQueryData(["debates", `${heart.debateId}`], () => {
          return {
            ...prevDebate,
            heartCnt: prevDebate.heartCnt - 1,
          };
        });
        return () => {
          queryClient.setQueryData(["hearts", `${heart.debateId}`], prevHeart);
          queryClient.setQueryData(
            ["debates", `${heart.debateId}`],
            prevDebate,
          );
        };
      }
    },
    onError: (error, variables, rollback) => {
      if (rollback) rollback();
      setIsErrorModalOn(true);
    },
  });
};
