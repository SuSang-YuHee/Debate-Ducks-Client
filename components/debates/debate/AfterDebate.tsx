import { useGetDebate } from "../../../utils/queries/debates";

export default function AfterDebate({ debateId }: { debateId: number }) {
  const { data } = useGetDebate(debateId);

  return (
    <div>
      <video src={data?.video_url} width="0" height="0"></video>
      <p>투표</p>
    </div>
  );
}
