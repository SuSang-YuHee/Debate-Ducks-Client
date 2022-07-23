import { useGetDebate } from "../../../utils/queries/debates";

import AfterDebate from "./AfterDebate";
import DebaterInfo from "./DebaterInfo";
import EditAndDelete from "./EditAndDelete";

export default function Debate({ debateId }: { debateId: number }) {
  const debate = useGetDebate(debateId);

  return (
    <div>
      <h1>{debate.data?.title}</h1>
      <p>{debate.data?.created_date}</p>
      <p>{debate.data?.created_date}</p>
      <p>{debate.data?.category}</p>
      <p>하트</p>
      <p>{debate.data?.heartCnt}</p>
      <EditAndDelete debateId={debateId} />
      <DebaterInfo debateId={debateId} />
      <pre>{debate.data?.contents}</pre>
      <AfterDebate debateId={debateId} />
    </div>
  );
}
