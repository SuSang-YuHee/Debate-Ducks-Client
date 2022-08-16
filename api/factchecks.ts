import axios from "axios";

import { FactcheckPatch, FactcheckPost } from "./../types";

//*- 팩트페크 생성
export const postFactcheck = async (factcheckPost: FactcheckPost) => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/factchecks`,
    factcheckPost,
    { withCredentials: true },
  );
  return data;
};

//*- 팩트페크 수정
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

//*- 팩트페크 삭제
export const deleteFactcheck = async (factcheckId: number) => {
  const { data } = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/factchecks/${factcheckId}`,
    {
      withCredentials: true,
    },
  );
  return data;
};
