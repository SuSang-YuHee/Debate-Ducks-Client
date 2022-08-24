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

import { IDebate, IDebatePost, IDebatePatch, IUser } from "../../types";

//# 토론 목록 조회 (무한 스크롤 적용)
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

//# 좋아요한 토론 목록 조회 (무한 스크롤 적용)
export const useGetDebatesHeart = (userId: string, order: string) => {
  const query = useInfiniteQuery(
    [queryKeys.debates, queryKeys.hearts],
    ({ pageParam = 0 }) => getDebatesHeart(userId, pageParam, order),
    {
      getNextPageParam: (lastPage) =>
        !lastPage.isLast ? lastPage.nextPage : undefined,
    },
  );
  return query;
};

//# 토론 조회
export const useGetDebate = (
  debateId: number,
  options?: UseQueryOptions<IDebate, AxiosError>,
) => {
  const query = useQuery<IDebate, AxiosError>(
    [queryKeys.debates, `${debateId}`],
    () => getDebate(debateId),
    { enabled: !!debateId, ...options },
  );

  return query;
};

//# 토론 생성
export const usePostDebate = (
  options?: UseMutationOptions<IDebatePost, AxiosError, IDebatePost>,
): UseMutationResult<IDebatePost, AxiosError, IDebatePost> => {
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

//# 토론 수정
export const usePatchDebate = (
  debateId: number,
  participant?: IUser,
  options?: UseMutationOptions<IDebatePatch, AxiosError, IDebatePatch>,
): UseMutationResult<IDebatePatch, AxiosError, IDebatePatch> => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation((debate) => patchDebate(debate), {
    ...options,
    onMutate: (debate) => {
      const prevDebate: IDebate | undefined = queryClient.getQueryData([
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
      queryClient.invalidateQueries([queryKeys.debates], { exact: true });
      if (/\/edit/.test(router.pathname)) {
        router.push(`/debate?debateId=${debateId}`);
      }
    },
    onError: (
      err: AxiosError<{ message: string }>,
      _,
      rollback: (() => IDebate) | undefined,
    ) => {
      if (rollback) rollback();
      //> 참여 실패 시 다른 참여자 보여주기 위함
      if (participant) {
        queryClient.invalidateQueries([queryKeys.debates, `${debateId}`]);
      }
      toast.error(
        `${err.response?.data?.message || "네트워크 에러가 발생했습니다."}`,
      );
    },
  });
};

//# 토론 삭제
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
