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

import { Debate, DebateAndUserID } from "../../types";

export const useGetHeart = (
  debateAndUserId: DebateAndUserID,
  options?: UseQueryOptions<boolean, AxiosError>,
) => {
  const query = useQuery<boolean, AxiosError>(
    ["hearts", `${debateAndUserId.target_debate_id}`],
    () => getHeart(debateAndUserId),
    options,
  );
  return query;
};

export const usePostHeart = (
  setIsErrModalOn: Dispatch<SetStateAction<boolean>>,
  options?: UseMutationOptions<DebateAndUserID, AxiosError, DebateAndUserID>,
): UseMutationResult<DebateAndUserID, AxiosError, DebateAndUserID> => {
  const queryClient = useQueryClient();
  return useMutation((debateAndUserId) => postHeart(debateAndUserId), {
    ...options,
    onMutate: (debateAndUserId) => {
      const prevHeart: boolean | undefined = queryClient.getQueryData([
        "hearts",
        `${debateAndUserId.target_debate_id}`,
      ]);
      const prevDebate: Debate | undefined = queryClient.getQueryData([
        "debates",
        `${debateAndUserId.target_debate_id}`,
      ]);
      if (prevHeart !== undefined && prevDebate !== undefined) {
        queryClient.cancelQueries([
          "hearts",
          `${debateAndUserId.target_debate_id}`,
        ]);
        queryClient.cancelQueries([
          "debates",
          `${debateAndUserId.target_debate_id}`,
        ]);
        queryClient.setQueryData(
          ["hearts", `${debateAndUserId.target_debate_id}`],
          () => {
            return !prevHeart;
          },
        );
        queryClient.setQueryData(
          ["debates", `${debateAndUserId.target_debate_id}`],
          () => {
            return {
              ...prevDebate,
              heartCnt: prevDebate.heartCnt + 1,
            };
          },
        );
        return () => {
          queryClient.setQueryData(
            ["hearts", `${debateAndUserId.target_debate_id}`],
            prevHeart,
          );
          queryClient.setQueryData(
            ["debates", `${debateAndUserId.target_debate_id}`],
            prevDebate,
          );
        };
      }
    },
    onError: (error, variables, rollback) => {
      if (rollback) rollback();
      setIsErrModalOn(true);
    },
  });
};

export const useDeleteHeart = (
  setIsErrModalOn: Dispatch<SetStateAction<boolean>>,
  options?: UseMutationOptions<DebateAndUserID, AxiosError, DebateAndUserID>,
): UseMutationResult<DebateAndUserID, AxiosError, DebateAndUserID> => {
  const queryClient = useQueryClient();
  return useMutation((debateAndUserId) => deleteHeart(debateAndUserId), {
    ...options,
    onMutate: (debateAndUserId) => {
      const prevHeart: boolean | undefined = queryClient.getQueryData([
        "hearts",
        `${debateAndUserId.target_debate_id}`,
      ]);
      const prevDebate: Debate | undefined = queryClient.getQueryData([
        "debates",
        `${debateAndUserId.target_debate_id}`,
      ]);
      if (prevHeart !== undefined && prevDebate !== undefined) {
        queryClient.cancelQueries([
          "hearts",
          `${debateAndUserId.target_debate_id}`,
        ]);
        queryClient.cancelQueries([
          "debates",
          `${debateAndUserId.target_debate_id}`,
        ]);
        queryClient.setQueryData(
          ["hearts", `${debateAndUserId.target_debate_id}`],
          () => {
            return !prevHeart;
          },
        );
        queryClient.setQueryData(
          ["debates", `${debateAndUserId.target_debate_id}`],
          () => {
            return {
              ...prevDebate,
              heartCnt: prevDebate.heartCnt - 1,
            };
          },
        );
        return () => {
          queryClient.setQueryData(
            ["hearts", `${debateAndUserId.target_debate_id}`],
            prevHeart,
          );
          queryClient.setQueryData(
            ["debates", `${debateAndUserId.target_debate_id}`],
            prevDebate,
          );
        };
      }
    },
    onError: (error, variables, rollback) => {
      if (rollback) rollback();
      setIsErrModalOn(true);
    },
  });
};
