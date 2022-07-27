import axios from "axios";

export const getUser = async () => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("debate-ducks-token")
      : null;
  if (token) {
    const { data } = await axios.get(
      `${process.env.NEXT_PUBLIC_API_URL}/users`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true,
      },
    );
    return data;
  }
  return null;
};
