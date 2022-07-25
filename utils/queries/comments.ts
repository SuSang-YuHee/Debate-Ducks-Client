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
import { queryStr } from ".";

import { CommentPatch, CommentPost, Order } from "../../types";

export const useGetComments = (debateId: number, order: Order) => {
  const query = useInfiniteQuery(
    [queryStr.comments, `${debateId}`],
    ({ pageParam = 0 }) => getComments(debateId, pageParam, order),
    {
      getNextPageParam: (lastPage) =>
        !lastPage.isLast ? lastPage.nextPage : undefined,
    },
  );
  return query;
};

export const usePostComment = (
  debateId: number,
  options?: UseMutationOptions<CommentPost, AxiosError, CommentPost>,
): UseMutationResult<CommentPost, AxiosError, CommentPost> => {
  const queryClient = useQueryClient();
  return useMutation((commentPost) => postComment(commentPost), {
    ...options,
    onSuccess: () => {
      queryClient.invalidateQueries([queryStr.comments, `${debateId}`]);
    },
    onError: (err) => {
      toast.error(`${err.response?.data}`);
    },
  });
};

export const usePatchComment = (
  debateId: number,
  options?: UseMutationOptions<CommentPatch, AxiosError, CommentPatch>,
): UseMutationResult<CommentPatch, AxiosError, CommentPatch> => {
  const queryClient = useQueryClient();
  return useMutation((commentPatch) => patchComment(commentPatch), {
    ...options,
    onSuccess: () => {
      queryClient.invalidateQueries([queryStr.comments, `${debateId}`]);
    },
    onError: (err) => {
      toast.error(`${err.message}`);
    },
  });
};

export const useDeleteComment = (
  debateId: number,
  options?: UseMutationOptions<number, AxiosError, number>,
): UseMutationResult<number, AxiosError, number> => {
  const queryClient = useQueryClient();
  return useMutation((commentId) => deleteComment(commentId), {
    ...options,
    onSuccess: () => {
      queryClient.invalidateQueries([queryStr.comments, `${debateId}`]);
    },
    onError: (err) => {
      toast.error(`${err.response?.data}`);
    },
  });
};
