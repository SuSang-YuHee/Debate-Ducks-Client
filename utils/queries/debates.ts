import { useRouter } from "next/router";
import { AxiosError } from "axios";
import {
  useMutation,
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

import { Debate, DebatePost, DebatePatch } from "../../types";

export const useGetDebate = (
  debateId: number,
  options?: UseQueryOptions<Debate, AxiosError>,
) => {
  const router = useRouter();
  const { isLoading, data } = useQuery<Debate, AxiosError>(
    ["debate", `${debateId}`],
    () => getDebate(debateId),
    {
      ...options,
      onError: () => {
        router.push("/"); //Todo: 에러 페이지로 이동
      },
    },
  );

  return { isLoading, data };
};

export const usePostDebate = (
  setIsErrorModalOn: Dispatch<SetStateAction<boolean>>,
): UseMutationResult<DebatePost, AxiosError, DebatePost> => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation((debate) => postDebate(debate), {
    onSuccess: (debateId) => {
      queryClient.invalidateQueries(["debates"]);
      router.push(`/debates/${debateId}`);
    },
    onError: () => {
      setIsErrorModalOn(true);
    },
  });
};

export const usePatchDebate = (
  setIsErrorModalOn: Dispatch<SetStateAction<boolean>>,
  isEdit?: boolean,
): UseMutationResult<DebatePatch, AxiosError, DebatePatch> => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation((debate) => patchDebate(debate), {
    onSuccess: (debateId) => {
      queryClient.invalidateQueries(["debate", `${debateId}`]);
      if (isEdit) router.push(`/debates/${debateId}`);
    },
    onError: () => {
      setIsErrorModalOn(true);
    },
  });
};

export const useDeleteDebate = (
  setIsErrorModalOn: Dispatch<SetStateAction<boolean>>,
): UseMutationResult<number, AxiosError, number> => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation((debateId) => deleteDebate(debateId), {
    onSuccess: () => {
      queryClient.invalidateQueries(["debates"]);
      router.push(`/debates`);
    },
    onError: () => {
      setIsErrorModalOn(true);
    },
  });
};
