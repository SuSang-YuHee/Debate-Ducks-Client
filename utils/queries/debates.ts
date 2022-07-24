import { useRouter } from "next/router";
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
  deleteDebate,
  getDebate,
  patchDebate,
  postDebate,
} from "../../api/debates";

import { Debate, DebatePost, DebatePatch, User } from "../../types";

export const useGetDebate = (
  debateId: number,
  options?: UseQueryOptions<Debate, AxiosError>,
) => {
  const query = useQuery<Debate, AxiosError>(
    ["debates", `${debateId}`],
    () => getDebate(debateId),
    options,
  );
  return query;
};

export const usePostDebate = (
  setIsErrModalOn: Dispatch<SetStateAction<boolean>>,
  options?: UseMutationOptions<DebatePost, AxiosError, DebatePost>,
): UseMutationResult<DebatePost, AxiosError, DebatePost> => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation((debate) => postDebate(debate), {
    ...options,
    onSuccess: () => {
      queryClient.invalidateQueries(["debates"], { exact: true });
      router.push(`/debates`);
    },
    onError: () => {
      setIsErrModalOn(true);
    },
  });
};

export const usePatchDebate = (
  debateId: number,
  setIsErrModalOn: Dispatch<SetStateAction<boolean>>,
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
        "debates",
        `${debateId}`,
      ]);
      if (prevDebate) {
        queryClient.cancelQueries(["debates", `${debateId}`]);
        queryClient.setQueryData(["debates", `${debateId}`], () => {
          return {
            ...prevDebate,
            participant,
          };
        });
        return () =>
          queryClient.setQueryData(["debates", `${debateId}`], prevDebate);
      }
    },
    onSuccess: () => {
      if (!participant) {
        queryClient.invalidateQueries(["debates", `${debateId}`]);
        router.push(`/debates/${debateId}`);
      }
    },
    onError: (error, variables, rollback) => {
      if (rollback) rollback();
      setIsErrModalOn(true);
    },
  });
};

export const useDeleteDebate = (
  setIsErrModalOn: Dispatch<SetStateAction<boolean>>,
  options?: UseMutationOptions<number, AxiosError, number>,
): UseMutationResult<number, AxiosError, number> => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation((debateId) => deleteDebate(debateId), {
    ...options,
    onSuccess: () => {
      queryClient.invalidateQueries(["debates"], { exact: true });
      router.push(`/debates`);
    },
    onError: () => {
      setIsErrModalOn(true);
    },
  });
};
