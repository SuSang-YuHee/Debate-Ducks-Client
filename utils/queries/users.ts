import { AxiosError } from "axios";
import {
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "react-query";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";

import {
  getUser,
  patchUserNickname,
  patchUserImage,
  patchUserPassword,
  login,
} from "../../api/users";
import { queryKeys } from ".";

import { IUser, IUserInfo } from "../../types";

//*- 사용자 정보 조회
export const useGetUser = (options?: UseQueryOptions<IUser, AxiosError>) => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("debate-ducks-token")
      : null;
  const query = useQuery<IUser, AxiosError>(
    [queryKeys.users],
    () => getUser(token),
    {
      enabled: !!token,
      ...options,
    },
  );
  return query;
};

//*- 로그인
export const useLogin = (
  options?: UseMutationOptions<
    string,
    AxiosError,
    Pick<IUserInfo, "email" | "password">
  >,
) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation((userInfo) => login(userInfo), {
    ...options,
    onSuccess: (data) => {
      localStorage.setItem("debate-ducks-token", data);

      queryClient.invalidateQueries([queryKeys.users]);
      queryClient.invalidateQueries([queryKeys.hearts]);
      queryClient.invalidateQueries([queryKeys.votes]);

      const storage = globalThis?.sessionStorage;
      const link =
        storage.getItem("prevPath") === "/signin" ||
        storage.getItem("prevPath") === "/signup"
          ? "/"
          : storage.getItem("prevPath") || "/";
      router.push(link);
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(
        `${err.response?.data?.message || "네트워크 에러가 발생했습니다."}`,
      );
    },
  });
};

//*- 사용자 이미지 수정
export const usePatchUserImage = (
  userId: string,
  formData: FormData | undefined,
) => {
  const queryClient = useQueryClient();
  return useMutation(() => patchUserImage(userId, formData), {
    onSuccess: () => {
      queryClient.invalidateQueries([queryKeys.users]);
      queryClient.invalidateQueries([queryKeys.debates]);
      queryClient.invalidateQueries([queryKeys.comments]);
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(
        `${err.response?.data?.message || "네트워크 에러가 발생했습니다."}`,
      );
    },
  });
};

//*- 사용자 닉네임 수정
export const usePatchUserNickname = (userId: string, nickname: string) => {
  const queryClient = useQueryClient();
  return useMutation(() => patchUserNickname(userId, nickname), {
    onSuccess: () => {
      queryClient.invalidateQueries([queryKeys.users]);
      queryClient.invalidateQueries([queryKeys.debates]);
      queryClient.invalidateQueries([queryKeys.comments]);
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(
        `${err.response?.data?.message || "네트워크 에러가 발생했습니다."}`,
      );
    },
  });
};

//*- 사용자 암호 수정
export const usePatchUserPassword = (
  userId: string,
  prevPassword: string,
  nextPassword: string,
) => {
  return useMutation(
    () => patchUserPassword(userId, prevPassword, nextPassword),
    {
      onSuccess: () => {
        toast.success("비밀번호 변경이 완료되었습니다.");
      },
      onError: (err: AxiosError<{ message: string }>) => {
        toast.error(
          `${err.response?.data?.message || "네트워크 에러가 발생했습니다."}`,
        );
      },
    },
  );
};
