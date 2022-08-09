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

export const useGetDebates = (searchValue: string, order: string) => {
  const query = useInfiniteQuery(
    [queryStr.debates],
    ({ pageParam = 0 }) => getDebates(searchValue, pageParam, order),
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
      router.push(`/`);
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(
        `${err.response?.data?.message || "네트워크 에러가 발생했습니다."}`,
      );
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
    onMutate: (debate) => {
      const prevDebate: Debate | undefined = queryClient.getQueryData([
        queryStr.debates,
        `${debateId}`,
      ]);
      if (prevDebate) {
        queryClient.cancelQueries([queryStr.debates, `${debateId}`]);
        queryClient.setQueryData([queryStr.debates, `${debateId}`], () => {
          return {
            ...prevDebate,
            ...debate,
            participant: participant || null,
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
      if (/\/edit/.test(router.pathname)) {
        router.push(`/${debateId}`);
      }
    },
    onError: (
      err: AxiosError<{ message: string }>,
      _,
      rollback: (() => Debate) | undefined,
    ) => {
      if (rollback) rollback();
      toast.error(
        `${err.response?.data?.message || "네트워크 에러가 발생했습니다."}`,
      );
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
      router.push(`/`);
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(
        `${err.response?.data?.message || "네트워크 에러가 발생했습니다."}`,
      );
    },
  });
};
