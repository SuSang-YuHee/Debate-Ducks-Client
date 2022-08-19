import axios from "axios";

import { ICommentPatch, ICommentPost } from "../types";

//*- 댓글 목록 조회 (무한 스크롤 적용)
export const getComments = async (
  debateId: number,
  page: number,
  order: string,
) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/comments/debate/${debateId}?page=${page}&order=${order}`,
    { withCredentials: true },
  );
  return { list: data.list, isLast: data.isLast, nextPage: page + 1 };
};

//*- 댓글 생성
export const postComment = async (commentPost: ICommentPost) => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/comments`,
    commentPost,
    { withCredentials: true },
  );
  return data;
};

//*- 댓글 수정
export const patchComment = async (commentPatch: ICommentPatch) => {
  const { data } = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_URL}/comments`,
    commentPatch,
    { withCredentials: true },
  );
  return data;
};

//*- 댓글 삭제
export const deleteComment = async (commentId: number) => {
  const { data } = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId}`,
    {
      withCredentials: true,
    },
  );
  return data;
};
