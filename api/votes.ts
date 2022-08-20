import axios from "axios";

import { IDebateAndUserID, IVotePostOrPatch } from "../types";

//# 투표 여부 및 찬반 조회
export const getVote = async (debateAndUserId: IDebateAndUserID) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/votes?target_debate_id=${debateAndUserId.target_debate_id}&target_user_id=${debateAndUserId.target_user_id}`,
    { withCredentials: true },
  );
  return data;
};

//# 투표 생성
export const postVote = async (votePost: IVotePostOrPatch) => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/votes`,
    votePost,
    { withCredentials: true },
  );
  return data;
};

//# 투표 수정
export const patchVote = async (votePatch: IVotePostOrPatch) => {
  const { data } = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_URL}/votes`,
    votePatch,
    {
      withCredentials: true,
    },
  );
  return data;
};
