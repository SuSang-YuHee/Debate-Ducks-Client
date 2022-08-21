import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { QueryClient, dehydrate } from "react-query";

import { getDebate } from "../api/debates";
import { useGetDebate } from "../utils/queries/debates";

import Error from "../components/common/Error";
import Debate from "../components/debates/debate";

export default function DebatePage() {
  const router = useRouter();
  const param = router.query;
  const debateId =
    typeof param?.debateId === "string" ? parseInt(param?.debateId) : 0;

  const debate = useGetDebate(debateId, {
    enabled: !!debateId,
  });

  if (debate.isError) return <Error />;
  return (
    <div className="inner">
      <Debate debateId={debateId} />
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
      dehydratedState: JSON.parse(JSON.stringify(dehydrate(queryClient))),
    },
  };
};
