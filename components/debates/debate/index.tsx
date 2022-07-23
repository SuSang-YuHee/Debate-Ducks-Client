import { useGetDebate } from "../../../utils/queries/debates";

import AfterDebate from "./AfterDebate";
import DebaterInfo from "./DebaterInfo";
import EditAndDelete from "./EditAndDelete";

export default function Debate({ debateId }: { debateId: number }) {
  const debate = useGetDebate(debateId, "01G85SA6V8NXD7XGB155SC4S17");

  return (
    <div>
      <h1>{debate.data?.title}</h1>
      <p>{debate.data?.created_date}</p>
      <p>{debate.data?.created_date}</p>
      <p>{debate.data?.category}</p>
      <p>{`${debate.data?.heart?.isHeart}`}</p>
      <p>{debate.data?.heart?.heartCnt}</p>
      <EditAndDelete debateId={debateId} />
      <DebaterInfo debateId={debateId} />
      <pre>{debate.data?.contents}</pre>
      <AfterDebate debateId={debateId} />
    </div>
  );
}
