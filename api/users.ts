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
      toast.success("로그인에 성공했습니다.");
    })
    .catch((err: AxiosError<{ message: string }>) => {
      console.log(err);
      toast.error(
        `${err.response?.data?.message || "네트워크 에러가 발생했습니다."}`,
      );
    });
};

export const patchUserImage = async (
  id: string,
  formData: FormData | undefined,
) => {
  const { data } = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${id}/image`,
    formData,
    {
      headers: { "content-type": "multipart/form-data" },
      withCredentials: true,
    },
  );
  return data;
};

export const patchUserNickname = async (id: string, nickname: string) => {
  const { data } = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${id}/nickname`,
    { nickname },
    {
      withCredentials: true,
    },
  );
  return data;
};

export const patchUserPassword = async (
  id: string,
  prevPassword: string,
  nextPassword: string,
) => {
  const { data } = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_URL}/users/${id}/password`,
    { prevPassword, nextPassword },
    { withCredentials: true },
  );
  return data;
};
