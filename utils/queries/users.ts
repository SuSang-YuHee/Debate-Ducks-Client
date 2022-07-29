import { AxiosError } from "axios";
import { useQuery, UseQueryOptions } from "react-query";

import { getUser, getUserImage, patchUser } from "../../api/users";
import { queryStr } from ".";

import { User } from "../../types";

export const useGetUser = (
  token: string,
  options?: UseQueryOptions<User, AxiosError>,
) => {
  const query = useQuery<User, AxiosError>(
    [queryStr.users],
    () => getUser(token),
    options,
  );
  return query;
};

export const useGetUserImage = (id: string) => {
  const query = useQuery(["userImage"], () => getUserImage(id));
  return query;
};

export const usePatchUser = (id: string) => {
  const query = useQuery(["nickname"], () => patchUser(id));
  return query;
};
