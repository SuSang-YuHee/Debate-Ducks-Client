import { useRouter } from "next/router";

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
