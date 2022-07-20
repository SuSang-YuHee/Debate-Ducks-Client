import axios from "axios";

import { DebatePost, DebatePatch } from "../types";

export const getDebate = async (debateId: number) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/debates/${debateId}`,
    { withCredentials: true },
  );
  return data;
};

export const postDebate = async (debate: DebatePost) => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/debates`,
    debate,
    { withCredentials: true },
  );
  return data;
};

export const patchDebate = async (debate: DebatePatch) => {
  const { data } = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_URL}/debates`,
    debate,
    { withCredentials: true },
  );
  return data;
};

export const deleteDebate = async (debateId: number) => {
  const { data } = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/debates/${debateId}`,
    { withCredentials: true },
  );
  return data;
};
