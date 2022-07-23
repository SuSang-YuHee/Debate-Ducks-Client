import type { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { dehydrate, QueryClient } from "react-query";

import { getDebate } from "../../api/debates";
import { useGetDebate } from "../../utils/queries/debates";

import Debate from "../../components/debates/debate";
import Comments from "../../components/debates/debate/Comments";

export default function Debates() {
  const router = useRouter();
  const param = router.query;
  const debateId =
    typeof param?.debateId === "string" ? parseInt(param?.debateId) : 0;
  const debate = useGetDebate(debateId);

  if (!debate.data) return <>404</>;
  return (
    <div>
      <Debate debateId={debateId} />
      <Comments debateId={debateId} />
      <p>이전, 다음, 목록 등등</p>
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const debateId =
    typeof context.params?.debateId === "string"
      ? parseInt(context.params?.debateId)
      : 0;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["debates", `${debateId}`], () =>
    getDebate(debateId),
  );
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
