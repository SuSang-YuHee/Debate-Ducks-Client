import axios from "axios";

import { FactcheckPatch, FactcheckPost } from "./../types";

export const postFactcheck = async (factcheckPost: FactcheckPost) => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/factchecks`,
    factcheckPost,
    { withCredentials: true },
  );
  return data;
};

export const patchFactcheck = async (factcheckPatch: FactcheckPatch) => {
  const { data } = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_URL}/factchecks`,
    factcheckPatch,
    {
      withCredentials: true,
    },
  );
  return data;
};

export const deleteFactcheck = async (factcheckId: number) => {
  const { data } = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/factchecks/${factcheckId}`,
    {
      withCredentials: true,
    },
  );
  return data;
};
