import axios from "axios";

export const getHeart = async (debateId: number, userId: string) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/hearts?target_debate_id=${debateId}&target_user_id=${userId}`,
    { withCredentials: true },
  );
  return data;
};

export const postHeart = async (debateId: number, userId: string) => {
  const { data } = await axios.post(
    `${process.env.NEXT_PUBLIC_API_URL}/hearts`,
    {
      target_debate_id: debateId,
      target_user_id: userId,
    },
    { withCredentials: true },
  );
  return data;
};

export const deleteHeart = async (debateId: number, userId: string) => {
  const { data } = await axios.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/hearts?target_debate_id=${debateId}&target_user_id=${userId}`,
    {
      withCredentials: true,
    },
  );
  return data;
};
