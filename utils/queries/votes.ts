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

import { postVote, patchVote, getVote } from "../../api/votes";

import { Debate, DebateAndUserID, Vote, VotePostOrPatch } from "../../types";

export const useGetVote = (
  debateAndUserId: DebateAndUserID,
  options?: UseQueryOptions<Vote, AxiosError>,
) => {
  const query = useQuery<Vote, AxiosError>(
    ["votes", `${debateAndUserId.target_debate_id}`],
    () => getVote(debateAndUserId),
    options,
  );
  return query;
};

export const usePostVote = (
  setIsErrModalOn: Dispatch<SetStateAction<boolean>>,
  options?: UseMutationOptions<VotePostOrPatch, AxiosError, VotePostOrPatch>,
): UseMutationResult<VotePostOrPatch, AxiosError, VotePostOrPatch> => {
  const queryClient = useQueryClient();
  return useMutation((votePostOrPatch) => postVote(votePostOrPatch), {
    ...options,
    onMutate: (votePostOrPatch) => {
      const prevVote: Vote | undefined = queryClient.getQueryData([
        "votes",
        `${votePostOrPatch.target_debate_id}`,
      ]);
      const prevDebate: Debate | undefined = queryClient.getQueryData([
        "debates",
        `${votePostOrPatch.target_debate_id}`,
      ]);
      if (prevVote !== undefined && prevDebate !== undefined) {
        queryClient.cancelQueries([
          "votes",
          `${votePostOrPatch.target_debate_id}`,
        ]);
        queryClient.cancelQueries([
          "debates",
          `${votePostOrPatch.target_debate_id}`,
        ]);
        queryClient.setQueryData(
          ["votes", `${votePostOrPatch.target_debate_id}`],
          () => {
            return {
              isVote: true,
              pros: votePostOrPatch.pros,
            };
          },
        );
        queryClient.setQueryData(
          ["debates", `${votePostOrPatch.target_debate_id}`],
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
            ["votes", `${votePostOrPatch.target_debate_id}`],
            prevVote,
          );
          queryClient.setQueryData(
            ["debates", `${votePostOrPatch.target_debate_id}`],
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

export const usePatchVote = (
  setIsErrModalOn: Dispatch<SetStateAction<boolean>>,
  options?: UseMutationOptions<VotePostOrPatch, AxiosError, VotePostOrPatch>,
): UseMutationResult<VotePostOrPatch, AxiosError, VotePostOrPatch> => {
  const queryClient = useQueryClient();
  return useMutation((votePostOrPatch) => patchVote(votePostOrPatch), {
    ...options,
    onMutate: (votePostOrPatch) => {
      const prevVote: Vote | undefined = queryClient.getQueryData([
        "votes",
        `${votePostOrPatch.target_debate_id}`,
      ]);
      const prevDebate: Debate | undefined = queryClient.getQueryData([
        "debates",
        `${votePostOrPatch.target_debate_id}`,
      ]);
      if (prevVote !== undefined && prevDebate !== undefined) {
        queryClient.cancelQueries([
          "votes",
          `${votePostOrPatch.target_debate_id}`,
        ]);
        queryClient.cancelQueries([
          "debates",
          `${votePostOrPatch.target_debate_id}`,
        ]);
        queryClient.setQueryData(
          ["votes", `${votePostOrPatch.target_debate_id}`],
          () => {
            return {
              isVote: true,
              pros: votePostOrPatch.pros,
            };
          },
        );
        queryClient.setQueryData(
          ["debates", `${votePostOrPatch.target_debate_id}`],
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
            ["debates", `${votePostOrPatch.target_debate_id}`],
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
