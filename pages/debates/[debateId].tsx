import { useRouter } from "next/router";

import { useGetDebate } from "../../utils/queries/debates";

import Debate from "../../components/debates/debate";

export default function Debates() {
  const router = useRouter();
  const param = router.query;
  const debateId =
    typeof param?.debateId === "string" ? parseInt(param?.debateId) : 0;

  const debate = useGetDebate(debateId, {
    enabled: !!debateId,
  });

  if (!debate.data) return <>404</>;
  return (
    <div className="inner">
      <Debate debateId={debateId} />
    </div>
  );
}
