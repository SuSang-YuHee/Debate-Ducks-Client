import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "react-query";

import { postVote, patchVote, getVote } from "../../api/votes";
import { queryStr } from ".";

import { Debate, DebateAndUserID, Vote, VotePostOrPatch } from "../../types";

export const useGetVote = (
  debateAndUserId: DebateAndUserID,
  options?: UseQueryOptions<Vote, AxiosError>,
) => {
  const query = useQuery<Vote, AxiosError>(
    [queryStr.votes, `${debateAndUserId.target_debate_id}`],
    () => getVote(debateAndUserId),
    {
      enabled: !!debateAndUserId.target_user_id,
      ...options,
    },
  );
  return query;
};

export const usePostVote = (
  options?: UseMutationOptions<VotePostOrPatch, AxiosError, VotePostOrPatch>,
): UseMutationResult<VotePostOrPatch, AxiosError, VotePostOrPatch> => {
  const queryClient = useQueryClient();
  return useMutation((votePostOrPatch) => postVote(votePostOrPatch), {
    ...options,
    onMutate: (votePostOrPatch) => {
      const prevVote: Vote | undefined = queryClient.getQueryData([
        queryStr.votes,
        `${votePostOrPatch.target_debate_id}`,
      ]);
      const prevDebate: Debate | undefined = queryClient.getQueryData([
        queryStr.debates,
        `${votePostOrPatch.target_debate_id}`,
      ]);
      if (prevVote !== undefined && prevDebate !== undefined) {
        queryClient.cancelQueries([
          queryStr.votes,
          `${votePostOrPatch.target_debate_id}`,
        ]);
        queryClient.cancelQueries([
          queryStr.debates,
          `${votePostOrPatch.target_debate_id}`,
        ]);
        queryClient.setQueryData(
          [queryStr.votes, `${votePostOrPatch.target_debate_id}`],
          () => {
            return {
              isVote: true,
              pros: votePostOrPatch.pros,
            };
          },
        );
        queryClient.setQueryData(
          [queryStr.debates, `${votePostOrPatch.target_debate_id}`],
          () => {
            if (votePostOrPatch.pros) {
              return {
                ...prevDebate,
                vote: {
                  prosCnt: prevDebate.vote.prosCnt + 1,
                  consCnt: prevDebate.vote.consCnt,
                },
              };
            } else {
              return {
                ...prevDebate,
                vote: {
                  prosCnt: prevDebate.vote.prosCnt,
                  consCnt: prevDebate.vote.consCnt + 1,
                },
              };
            }
          },
        );
        return () => {
          queryClient.setQueryData(
            [queryStr.votes, `${votePostOrPatch.target_debate_id}`],
            prevVote,
          );
          queryClient.setQueryData(
            [queryStr.debates, `${votePostOrPatch.target_debate_id}`],
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

export const usePatchVote = (
  options?: UseMutationOptions<VotePostOrPatch, AxiosError, VotePostOrPatch>,
): UseMutationResult<VotePostOrPatch, AxiosError, VotePostOrPatch> => {
  const queryClient = useQueryClient();
  return useMutation((votePostOrPatch) => patchVote(votePostOrPatch), {
    ...options,
    onMutate: (votePostOrPatch) => {
      const prevVote: Vote | undefined = queryClient.getQueryData([
        queryStr.votes,
        `${votePostOrPatch.target_debate_id}`,
      ]);
      const prevDebate: Debate | undefined = queryClient.getQueryData([
        queryStr.debates,
        `${votePostOrPatch.target_debate_id}`,
      ]);
      if (prevVote !== undefined && prevDebate !== undefined) {
        queryClient.cancelQueries([
          queryStr.votes,
          `${votePostOrPatch.target_debate_id}`,
        ]);
        queryClient.cancelQueries([
          queryStr.debates,
          `${votePostOrPatch.target_debate_id}`,
        ]);
        queryClient.setQueryData(
          [queryStr.votes, `${votePostOrPatch.target_debate_id}`],
          () => {
            return {
              isVote: true,
              pros: votePostOrPatch.pros,
            };
          },
        );
        queryClient.setQueryData(
          [queryStr.debates, `${votePostOrPatch.target_debate_id}`],
          () => {
            if (votePostOrPatch.pros) {
              return {
                ...prevDebate,
                vote: {
                  prosCnt: prevDebate.vote.prosCnt + 1,
                  consCnt: prevDebate.vote.consCnt - 1,
                },
              };
            } else {
              return {
                ...prevDebate,
                vote: {
                  prosCnt: prevDebate.vote.prosCnt - 1,
                  consCnt: prevDebate.vote.consCnt + 1,
                },
              };
            }
          },
        );
        return () => {
          queryClient.setQueryData(
            [queryStr.debates, `${votePostOrPatch.target_debate_id}`],
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
