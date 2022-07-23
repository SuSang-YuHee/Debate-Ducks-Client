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
  setIsErrorModalOn: Dispatch<SetStateAction<boolean>>,
): UseMutationResult<DebatePost, AxiosError, DebatePost> => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation((debate) => postDebate(debate), {
    onSuccess: () => {
      queryClient.invalidateQueries(["debates"], { exact: true });
      router.push(`/debates`);
    },
    onError: () => {
      setIsErrorModalOn(true);
    },
  });
};

export const usePatchDebate = (
  debateId: number,
  setIsErrorModalOn: Dispatch<SetStateAction<boolean>>,
  participant?: User,
): UseMutationResult<DebatePatch, AxiosError, DebatePatch> => {
  const router = useRouter();
  const queryClient = useQueryClient();
  return useMutation((debate) => patchDebate(debate), {
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
      queryClient.invalidateQueries(["debates"], { exact: true });
      router.push(`/debates`);
    },
    onError: () => {
      setIsErrorModalOn(true);
    },
  });
};
