import axios from "axios";

import { CommentPatch, CommentPost, Order } from "../types";

export const getComments = async (
  debateId: number,
  page: number,
  order?: Order,
) => {
  const { data } = await axios.get(
    `${
      process.env.NEXT_PUBLIC_API_URL
    }/comments/debate/${debateId}?page=${page}&${order || "ASC"}`,
    { withCredentials: true },
  );
  return { list: data.list, isLast: data.isLast, nextPage: page + 1 };
};

export const postComment = async (commentPost: CommentPost) => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/comments`,
    commentPost,
    { withCredentials: true },
  );
  return data;
};

export const patchComment = async (commentPatch: CommentPatch) => {
  const { data } = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_URL}/comments`,
    commentPatch,
    { withCredentials: true },
  );
  return data;
};

export const deleteComment = async (commentId: number) => {
  const { data } = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/comments/${commentId}`,
    {
      withCredentials: true,
    },
  );
  return data;
};
