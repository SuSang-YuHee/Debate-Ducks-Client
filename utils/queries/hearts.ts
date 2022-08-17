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

import { getHeart, postHeart, deleteHeart } from "../../api/hearts";
import { queryKeys } from ".";

import { IDebate, IDebateAndUserID } from "../../types";

//*- 좋아요 여부 조회
export const useGetHeart = (
  debateAndUserId: IDebateAndUserID,
  options?: UseQueryOptions<boolean, AxiosError>,
) => {
  const query = useQuery<boolean, AxiosError>(
    [queryKeys.hearts, `${debateAndUserId.target_debate_id}`],
    () => getHeart(debateAndUserId),
    {
      enabled: !!debateAndUserId.target_user_id,
      ...options,
    },
  );
  return query;
};

//*- 좋아요 생성
export const usePostHeart = (
  options?: UseMutationOptions<IDebateAndUserID, AxiosError, IDebateAndUserID>,
): UseMutationResult<IDebateAndUserID, AxiosError, IDebateAndUserID> => {
  const queryClient = useQueryClient();
  return useMutation((debateAndUserId) => postHeart(debateAndUserId), {
    ...options,
    onMutate: (debateAndUserId) => {
      const prevHeart: boolean | undefined = queryClient.getQueryData([
        queryKeys.hearts,
        `${debateAndUserId.target_debate_id}`,
      ]);
      const prevDebate: IDebate | undefined = queryClient.getQueryData([
        queryKeys.debates,
        `${debateAndUserId.target_debate_id}`,
      ]);
      if (prevHeart !== undefined && prevDebate !== undefined) {
        queryClient.cancelQueries([
          queryKeys.hearts,
          `${debateAndUserId.target_debate_id}`,
        ]);
        queryClient.cancelQueries([
          queryKeys.debates,
          `${debateAndUserId.target_debate_id}`,
        ]);
        queryClient.setQueryData(
          [queryKeys.hearts, `${debateAndUserId.target_debate_id}`],
          () => {
            return !prevHeart;
          },
        );
        queryClient.setQueryData(
          [queryKeys.debates, `${debateAndUserId.target_debate_id}`],
          () => {
            return {
              ...prevDebate,
              hearts_cnt: prevDebate.hearts_cnt + 1,
            };
          },
        );
        return () => {
          queryClient.setQueryData(
            [queryKeys.hearts, `${debateAndUserId.target_debate_id}`],
            prevHeart,
          );
          queryClient.setQueryData(
            [queryKeys.debates, `${debateAndUserId.target_debate_id}`],
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

//*- 좋아요 삭제
export const useDeleteHeart = (
  options?: UseMutationOptions<IDebateAndUserID, AxiosError, IDebateAndUserID>,
): UseMutationResult<IDebateAndUserID, AxiosError, IDebateAndUserID> => {
  const queryClient = useQueryClient();
  return useMutation((debateAndUserId) => deleteHeart(debateAndUserId), {
    ...options,
    onMutate: (debateAndUserId) => {
      const prevHeart: boolean | undefined = queryClient.getQueryData([
        queryKeys.hearts,
        `${debateAndUserId.target_debate_id}`,
      ]);
      const prevDebate: IDebate | undefined = queryClient.getQueryData([
        queryKeys.debates,
        `${debateAndUserId.target_debate_id}`,
      ]);
      if (prevHeart !== undefined && prevDebate !== undefined) {
        queryClient.cancelQueries([
          queryKeys.hearts,
          `${debateAndUserId.target_debate_id}`,
        ]);
        queryClient.cancelQueries([
          queryKeys.debates,
          `${debateAndUserId.target_debate_id}`,
        ]);
        queryClient.setQueryData(
          [queryKeys.hearts, `${debateAndUserId.target_debate_id}`],
          () => {
            return !prevHeart;
          },
        );
        queryClient.setQueryData(
          [queryKeys.debates, `${debateAndUserId.target_debate_id}`],
          () => {
            return {
              ...prevDebate,
              hearts_cnt: prevDebate.hearts_cnt - 1,
            };
          },
        );
        return () => {
          queryClient.setQueryData(
            [queryKeys.hearts, `${debateAndUserId.target_debate_id}`],
            prevHeart,
          );
          queryClient.setQueryData(
            [queryKeys.debates, `${debateAndUserId.target_debate_id}`],
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
