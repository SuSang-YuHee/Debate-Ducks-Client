import { useGetDebate } from "../../../utils/queries/debates";

export default function AfterDebate({ debateId }: { debateId: number }) {
  const debate = useGetDebate(debateId, "01G85SA6V8NXD7XGB155SC4S17");

  return (
    <div>
      {debate.data?.video_url ? (
        <div>
          <video src={debate.data?.video_url} width="0" height="0"></video>
          <p>투표</p>
        </div>
      ) : null}
    </div>
  );
}
