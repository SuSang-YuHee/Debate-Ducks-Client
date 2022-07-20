import { useGetDebate } from "../../../utils/queries/debates";

import AfterDebate from "./AfterDebate";
import DebaterInfo from "./DebaterInfo";
import EditAndDelete from "./EditAndDelete";

export default function Debate({ debateId }: { debateId: number }) {
  const { data } = useGetDebate(debateId);

  return (
    <div>
      <h1>{data?.title}</h1>
      <p>{data?.created_date.toString()}</p>
      <p>{data?.created_date.toString()}</p>
      <p>{data?.category}</p>
      <EditAndDelete debateId={debateId} />
      <DebaterInfo debateId={debateId} />
      <pre>{data?.contents}</pre>
      {data?.video_url ? <AfterDebate debateId={debateId} /> : null}
    </div>
  );
}
