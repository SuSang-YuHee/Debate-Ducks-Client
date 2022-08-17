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
import { queryKeys } from ".";

import {
  IDebate,
  IDebateAndUserID,
  IVote,
  IVotePostOrPatch,
} from "../../types";

//*- 투표 여부 및 찬반 조회
export const useGetVote = (
  debateAndUserId: IDebateAndUserID,
  options?: UseQueryOptions<IVote, AxiosError>,
) => {
  const query = useQuery<IVote, AxiosError>(
    [queryKeys.votes, `${debateAndUserId.target_debate_id}`],
    () => getVote(debateAndUserId),
    {
      enabled: !!debateAndUserId.target_user_id,
      ...options,
    },
  );
  return query;
};

//*- 투표 생성
export const usePostVote = (
  options?: UseMutationOptions<IVotePostOrPatch, AxiosError, IVotePostOrPatch>,
): UseMutationResult<IVotePostOrPatch, AxiosError, IVotePostOrPatch> => {
  const queryClient = useQueryClient();
  return useMutation((votePostOrPatch) => postVote(votePostOrPatch), {
    ...options,
    onMutate: (votePostOrPatch) => {
      const prevVote: IVote | undefined = queryClient.getQueryData([
        queryKeys.votes,
        `${votePostOrPatch.target_debate_id}`,
      ]);
      const prevDebate: IDebate | undefined = queryClient.getQueryData([
        queryKeys.debates,
        `${votePostOrPatch.target_debate_id}`,
      ]);
      if (prevVote !== undefined && prevDebate !== undefined) {
        queryClient.cancelQueries([
          queryKeys.votes,
          `${votePostOrPatch.target_debate_id}`,
        ]);
        queryClient.cancelQueries([
          queryKeys.debates,
          `${votePostOrPatch.target_debate_id}`,
        ]);
        queryClient.setQueryData(
          [queryKeys.votes, `${votePostOrPatch.target_debate_id}`],
          () => {
            return {
              isVote: true,
              pros: votePostOrPatch.pros,
            };
          },
        );
        queryClient.setQueryData(
          [queryKeys.debates, `${votePostOrPatch.target_debate_id}`],
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
            [queryKeys.votes, `${votePostOrPatch.target_debate_id}`],
            prevVote,
          );
          queryClient.setQueryData(
            [queryKeys.debates, `${votePostOrPatch.target_debate_id}`],
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

//*- 투표 수정
export const usePatchVote = (
  options?: UseMutationOptions<IVotePostOrPatch, AxiosError, IVotePostOrPatch>,
): UseMutationResult<IVotePostOrPatch, AxiosError, IVotePostOrPatch> => {
  const queryClient = useQueryClient();
  return useMutation((votePostOrPatch) => patchVote(votePostOrPatch), {
    ...options,
    onMutate: (votePostOrPatch) => {
      const prevVote: IVote | undefined = queryClient.getQueryData([
        queryKeys.votes,
        `${votePostOrPatch.target_debate_id}`,
      ]);
      const prevDebate: IDebate | undefined = queryClient.getQueryData([
        queryKeys.debates,
        `${votePostOrPatch.target_debate_id}`,
      ]);
      if (prevVote !== undefined && prevDebate !== undefined) {
        queryClient.cancelQueries([
          queryKeys.votes,
          `${votePostOrPatch.target_debate_id}`,
        ]);
        queryClient.cancelQueries([
          queryKeys.debates,
          `${votePostOrPatch.target_debate_id}`,
        ]);
        queryClient.setQueryData(
          [queryKeys.votes, `${votePostOrPatch.target_debate_id}`],
          () => {
            return {
              isVote: true,
              pros: votePostOrPatch.pros,
            };
          },
        );
        queryClient.setQueryData(
          [queryKeys.debates, `${votePostOrPatch.target_debate_id}`],
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
            [queryKeys.debates, `${votePostOrPatch.target_debate_id}`],
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
