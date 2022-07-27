import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { AxiosError } from "axios";
import {
  useInfiniteQuery,
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "react-query";

import {
  deleteDebate,
  getDebate,
  getDebates,
  getDebatesHeart,
  patchDebate,
  postDebate,
} from "../../api/debates";
import { queryStr } from ".";

import { Debate, DebatePost, DebatePatch, User } from "../../types";

export const useGetDebates = (order: string) => {
  const query = useInfiniteQuery(
    [queryStr.debates],
    ({ pageParam = 0 }) => getDebates(pageParam, order),
    {
      getNextPageParam: (lastPage) =>
        !lastPage.isLast ? lastPage.nextPage : undefined,
    },
  );
  return query;
};

export const useGetDebatesHeart = (userId: string, order: string) => {
  const query = useInfiniteQuery(
    [queryStr.debates, "heart"],
    ({ pageParam = 0 }) => getDebatesHeart(userId, pageParam, order),
    {
      getNextPageParam: (lastPage) =>
        !lastPage.isLast ? lastPage.nextPage : undefined,
    },
  );
  return query;
};

export const useGetDebate = (
  debateId: number,
  options?: UseQueryOptions<Debate, AxiosError>,
) => {
  const query = useQuery<Debate, AxiosError>(
    [queryStr.debates, `${debateId}`],
    () => getDebate(debateId),
    options,
  );
  return query;
};

export const usePostDebate = (
  options?: UseMutationOptions<DebatePost, AxiosError, DebatePost>,
): UseMutationResult<DebatePost, AxiosError, DebatePost> => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation((debate) => postDebate(debate), {
    ...options,
    onSuccess: () => {
      queryClient.invalidateQueries([queryStr.debates], { exact: true });
      router.push(`/debates`);
    },
    onError: (err) => {
      toast.error(`${err.response?.data}`);
    },
  });
};

export const usePatchDebate = (
  debateId: number,
  participant?: User,
  options?: UseMutationOptions<DebatePatch, AxiosError, DebatePatch>,
): UseMutationResult<DebatePatch, AxiosError, DebatePatch> => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation((debate) => patchDebate(debate), {
    ...options,
    onMutate: () => {
      if (!participant) return;
      const prevDebate: Debate | undefined = queryClient.getQueryData([
        queryStr.debates,
        `${debateId}`,
      ]);
      if (prevDebate) {
        queryClient.cancelQueries([queryStr.debates, `${debateId}`]);
        queryClient.setQueryData([queryStr.debates, `${debateId}`], () => {
          return {
            ...prevDebate,
            participant,
          };
        });
        return () =>
          queryClient.setQueryData(
            [queryStr.debates, `${debateId}`],
            prevDebate,
          );
      }
    },
    onSuccess: () => {
      if (!participant) {
        queryClient.invalidateQueries([queryStr.debates, `${debateId}`]);
        router.push(`/debates/${debateId}`);
      }
    },
    onError: (err, variables, rollback) => {
      if (rollback) rollback();
      toast.error(`${err.message}`);
    },
  });
};

export const useDeleteDebate = (
  options?: UseMutationOptions<number, AxiosError, number>,
): UseMutationResult<number, AxiosError, number> => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation((debateId) => deleteDebate(debateId), {
    ...options,
    onSuccess: () => {
      queryClient.invalidateQueries([queryStr.debates], { exact: true });
      router.push(`/debates`);
    },
    onError: (err) => {
      toast.error(`${err.message}`);
    },
  });
};
