import { toast } from "react-hot-toast";
import axios, { AxiosError } from "axios";

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

export const login = (
  email: string,
  password: string,
  callback?: () => void,
) => {
  axios
    .post(
      `${process.env.NEXT_PUBLIC_API_URL}/users/login`,
      { email, password },
      { withCredentials: true },
    )
    .then((res) => {
      localStorage.setItem("debate-ducks-token", res.data);
      if (callback) callback();
    })
    .catch((err: AxiosError<{ message: string }>) => {
      console.log(err);
      toast.error(`${err.response?.data?.message || "네트워크 에러 발생"}`);
    });
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
