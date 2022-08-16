import { toast } from "react-hot-toast";
import { AxiosError } from "axios";
import {
  useInfiniteQuery,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from "react-query";

import {
  deleteComment,
  postComment,
  patchComment,
  getComments,
} from "../../api/comments";
import { queryKeys } from ".";

import { CommentPatch, CommentPost } from "../../types";

//*- 댓글 목록 조회 (무한 스크롤 적용)
export const useGetComments = (debateId: number, order: string) => {
  const query = useInfiniteQuery(
    [queryKeys.comments, `${debateId}`],
    ({ pageParam = 0 }) => getComments(debateId, pageParam, order),
    {
      getNextPageParam: (lastPage) =>
        !lastPage.isLast ? lastPage.nextPage : undefined,
    },
  );
  return query;
};

//*- 댓글 생성
export const usePostComment = (
  debateId: number,
  options?: UseMutationOptions<CommentPost, AxiosError, CommentPost>,
): UseMutationResult<CommentPost, AxiosError, CommentPost> => {
  const queryClient = useQueryClient();
  return useMutation((commentPost) => postComment(commentPost), {
    ...options,
    onSuccess: () => {
      queryClient.invalidateQueries([queryKeys.comments, `${debateId}`]);
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(
        `${err.response?.data?.message || "네트워크 에러가 발생했습니다."}`,
      );
    },
  });
};

//*- 댓글 수정
export const usePatchComment = (
  debateId: number,
  options?: UseMutationOptions<CommentPatch, AxiosError, CommentPatch>,
): UseMutationResult<CommentPatch, AxiosError, CommentPatch> => {
  const queryClient = useQueryClient();
  return useMutation((commentPatch) => patchComment(commentPatch), {
    ...options,
    onSuccess: () => {
      queryClient.invalidateQueries([queryKeys.comments, `${debateId}`]);
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(
        `${err.response?.data?.message || "네트워크 에러가 발생했습니다."}`,
      );
    },
  });
};

//*- 댓글 삭제
export const useDeleteComment = (
  debateId: number,
  options?: UseMutationOptions<number, AxiosError, number>,
): UseMutationResult<number, AxiosError, number> => {
  const queryClient = useQueryClient();
  return useMutation((commentId) => deleteComment(commentId), {
    ...options,
    onSuccess: () => {
      queryClient.invalidateQueries([queryKeys.comments, `${debateId}`]);
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(
        `${err.response?.data?.message || "네트워크 에러가 발생했습니다."}`,
      );
    },
  });
};
