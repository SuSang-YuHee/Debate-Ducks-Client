import { useGetDebate } from "../../../utils/queries/debates";
import styles from "./index.module.scss";

import Factchecks from "./Factchecks";
// import Vote from "./Vote";

export default function AfterDebate({ debateId }: { debateId: number }) {
  const debate = useGetDebate(debateId);

  return debate.data?.video_url ? (
    <>
      <div className={styles.name}>토론 영상</div>
      <div className={styles.video_box}>
        <video className={styles.video} controls preload="auto">
          <source src={debate.data?.video_url} type="video/webm"></source>
        </video>
      </div>
      <div className={styles.line}></div>
      <div className={styles.name}>팩트체크</div>
      <Factchecks debateId={debateId} />
      {/* <div className={styles.line}></div>
      <Vote debateId={debateId} /> */}
    </>
  ) : null;
}
