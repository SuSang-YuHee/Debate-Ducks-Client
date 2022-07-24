import { useGetDebate } from "../../../utils/queries/debates";
import Factchecks from "./Factchecks";

import Vote from "./Vote";

export default function AfterDebate({ debateId }: { debateId: number }) {
  const debate = useGetDebate(debateId);

  return (
    <div>
      {debate.data?.video_url ? (
        <div>
          {/* <video width="0" height="0" controls preload="auto">
            <source src={debate.data?.video_url} type="video/webm"></source>
          </video> */}
          <Factchecks debateId={debateId} />
          <Vote debateId={debateId} />
        </div>
      ) : null}
    </div>
  );
}
