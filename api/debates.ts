import axios from "axios";

import { DebatePost, DebatePatch, Order } from "../types";

export const getDebates = async (page: string, order: Order) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/debates?page=${page}&order=${order}`,
    { withCredentials: true },
  );
  return { list: data.list, isLast: data.isLast, nextPage: page + 1 };
};

export const getDebate = async (debateId: number) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/debates/${debateId}`,
    { withCredentials: true },
  );
  return data;
};

export const postDebate = async (debatePost: DebatePost) => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/debates`,
    debatePost,
    { withCredentials: true },
  );
  return data;
};

export const patchDebate = async (debatePatch: DebatePatch) => {
  const { data } = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_URL}/debates`,
    debatePatch,
    {
      withCredentials: true,
    },
  );
  return data;
};

export const deleteDebate = async (debateId: number) => {
  const { data } = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/debates/${debateId}`,
    {
      withCredentials: true,
    },
  );
  return data;
};
