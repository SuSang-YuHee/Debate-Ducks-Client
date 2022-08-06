import { AxiosError } from "axios";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "react-query";
import { toast } from "react-hot-toast";

import { getUser, patchUser, patchUserImage } from "../../api/users";
import { queryStr } from ".";

import { User } from "../../types";

export const useGetUser = (options?: UseQueryOptions<User, AxiosError>) => {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("debate-ducks-token")
      : null;
  const query = useQuery<User, AxiosError>(
    [queryStr.users],
    () => getUser(token),
    {
      enabled: !!token,
      ...options,
    },
  );
  return query;
};

export const usePatchUserImage = (
  userId: string,
  formData: FormData | undefined,
) => {
  const queryClient = useQueryClient();
  return useMutation(() => patchUserImage(userId, formData), {
    onSuccess: () => {
      queryClient.invalidateQueries([queryStr.users]);
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(
        `${err.response?.data?.message || "네트워크 에러가 발생했습니다."}`,
      );
    },
  });
};

export const usePatchUser = (userId: string) => {
  const queryClient = useQueryClient();
  return useMutation(() => patchUser(userId), {
    onSuccess: () => {
      queryClient.invalidateQueries([queryStr.users]);
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(
        `${err.response?.data?.message || "네트워크 에러가 발생했습니다."}`,
      );
    },
  });
};
