import { useGetDebate } from "../../../utils/queries/debates";

export default function AfterDebate({ debateId }: { debateId: number }) {
  const debate = useGetDebate(debateId);

  return (
    <div>
      {debate.data?.video_url ? (
        <div>
          <video src={debate.data?.video_url} width="0" height="0"></video>
          <p>팩트체크</p>
          <p>투표</p>
        </div>
      ) : null}
    </div>
  );
}
