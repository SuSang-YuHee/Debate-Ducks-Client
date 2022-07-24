import axios from "axios";

import { DebateAndUserID } from "./../types";

export const getHeart = async (debateAndUserId: DebateAndUserID) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/hearts?target_debate_id=${debateAndUserId.target_debate_id}&target_user_id=${debateAndUserId.target_user_id}`,
    { withCredentials: true },
  );
  return data;
};

export const postHeart = async (debateAndUserId: DebateAndUserID) => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/hearts`,
    debateAndUserId,
    { withCredentials: true },
  );
  return data;
};

export const deleteHeart = async (debateAndUserId: DebateAndUserID) => {
  const { data } = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/hearts?target_debate_id=${debateAndUserId.target_debate_id}&target_user_id=${debateAndUserId.target_user_id}`,
    {
      withCredentials: true,
    },
  );
  return data;
};
