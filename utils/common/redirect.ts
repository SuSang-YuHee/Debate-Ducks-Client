import { NextApiResponse } from "next/types";

export const redirect = (
  isLoading: NextApiResponse<boolean>,
  error: Error,
  isData: boolean,
) => {
  if (!isData) {
    console.log("데이터 없음");
    return;
  }
  if (isLoading) {
    console.log("로딩중");
    return;
  }
  if (error) {
    console.log("에러 발생");
    return;
  }
};
