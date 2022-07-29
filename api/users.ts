import axios from "axios";

export const getUser = async (token: string) => {
  const { data } = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true,
  });
  return data;
};

export const getUserImage = async (id: string) => {
  const { data } = await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/users/image?user=${id}`,
    {
      withCredentials: true,
    },
  );
  return data;
};

export const patchUser = async (id: string) => {
  const { data } = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${id}`,
    {
      withCredential: true,
    },
  );
  return data;
};
