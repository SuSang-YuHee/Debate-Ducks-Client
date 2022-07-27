import { AxiosError } from "axios";
import { useQuery, UseQueryOptions } from "react-query";

import { getUser } from "../../api/users";
import { queryStr } from ".";

import { User } from "../../types";

export const useGetUser = (options?: UseQueryOptions<User, AxiosError>) => {
  const query = useQuery<User, AxiosError>([queryStr.users], () => getUser(), {
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
    ...options,
  });
  return query;
};
