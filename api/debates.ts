import axios from "axios";

import { DebatePost, DebatePatch } from "../types";

//*- 토론 목록 조회 (무한 스크롤 적용)
export const getDebates = async (
  searchValue: string,
  page: string,
  order: string,
) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/debates?title=${searchValue}&page=${page}&order=${order}`,
    { withCredentials: true },
  );
  return { list: data.list, isLast: data.isLast, nextPage: page + 1 };
};

//*- 좋아요한 토론 목록 조회 (무한 스크롤 적용)
export const getDebatesHeart = async (
  userId: string,
  page: string,
  order: string,
) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${userId}/hearts?page=${page}&order=${order}`,
    { withCredentials: true },
  );
  return { list: data.list, isLast: data.isLast, nextPage: page + 1 };
};

//*- 토론 조회
export const getDebate = async (debateId: number) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/debates/${debateId}`,
    { withCredentials: true },
  );
  return data;
};

//*- 토론 생성
export const postDebate = async (debatePost: DebatePost) => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/debates`,
    debatePost,
    { withCredentials: true },
  );
  return data;
};

//*- 토론 수정
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

//*- 토론 삭제
export const deleteDebate = async (debateId: number) => {
  const { data } = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/debates/${debateId}`,
    {
      withCredentials: true,
    },
  );
  return data;
};
