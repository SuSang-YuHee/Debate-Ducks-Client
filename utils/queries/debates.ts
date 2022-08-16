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
import { queryKeys } from ".";

import { Debate, DebatePost, DebatePatch, User } from "../../types";

//*- 토론 목록 조회 (무한 스크롤 적용)
export const useGetDebates = (searchValue: string, order: string) => {
  const query = useInfiniteQuery(
    [queryKeys.debates],
    ({ pageParam = 0 }) => getDebates(searchValue, pageParam, order),
    {
      getNextPageParam: (lastPage) =>
        !lastPage.isLast ? lastPage.nextPage : undefined,
    },
  );
  return query;
};

//*- 좋아요한 토론 목록 조회 (무한 스크롤 적용)
export const useGetDebatesHeart = (userId: string, order: string) => {
  const query = useInfiniteQuery(
    [queryKeys.debates, "heart"],
    ({ pageParam = 0 }) => getDebatesHeart(userId, pageParam, order),
    {
      getNextPageParam: (lastPage) =>
        !lastPage.isLast ? lastPage.nextPage : undefined,
    },
  );
  return query;
};

//*- 토론 조회
export const useGetDebate = (
  debateId: number,
  options?: UseQueryOptions<Debate, AxiosError>,
) => {
  const query = useQuery<Debate, AxiosError>(
    [queryKeys.debates, `${debateId}`],
    () => getDebate(debateId),
    options,
  );

  return query;
};

//*- 토론 생성
export const usePostDebate = (
  options?: UseMutationOptions<DebatePost, AxiosError, DebatePost>,
): UseMutationResult<DebatePost, AxiosError, DebatePost> => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation((debate) => postDebate(debate), {
    ...options,
    onSuccess: () => {
      queryClient.invalidateQueries([queryKeys.debates], { exact: true });
      router.push(`/`);
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(
        `${err.response?.data?.message || "네트워크 에러가 발생했습니다."}`,
      );
    },
  });
};

//*- 토론 수정
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
        queryKeys.debates,
        `${debateId}`,
      ]);
      if (prevDebate) {
        queryClient.cancelQueries([queryKeys.debates, `${debateId}`]);
        queryClient.setQueryData([queryKeys.debates, `${debateId}`], () => {
          return {
            ...prevDebate,
            ...debate,
            participant: participant || null,
          };
        });
        return () =>
          queryClient.setQueryData(
            [queryKeys.debates, `${debateId}`],
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

//*- 토론 삭제
export const useDeleteDebate = (
  options?: UseMutationOptions<number, AxiosError, number>,
): UseMutationResult<number, AxiosError, number> => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation((debateId) => deleteDebate(debateId), {
    ...options,
    onSuccess: () => {
      queryClient.invalidateQueries([queryKeys.debates], { exact: true });
      router.push(`/`);
    },
    onError: (err: AxiosError<{ message: string }>) => {
      toast.error(
        `${err.response?.data?.message || "네트워크 에러가 발생했습니다."}`,
      );
    },
  });
};
