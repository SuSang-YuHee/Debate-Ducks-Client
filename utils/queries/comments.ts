import { AxiosError } from "axios";
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "react-query";
import { Dispatch, SetStateAction } from "react";

import {
  deleteComment,
  postComment,
  patchComment,
  getComments,
} from "../../api/comments";
import { queryStr } from ".";

import { Order } from "../../types";

export const useGetComments = (
  debateId: number,
  page?: number,
  order?: Order,
  options?: UseQueryOptions<[], AxiosError>,
) => {
  const query = useQuery<[], AxiosError>(
    [queryStr.comments, `${debateId}`],
    () => getComments(debateId, page, order),
    options,
  );
  return query;
};
