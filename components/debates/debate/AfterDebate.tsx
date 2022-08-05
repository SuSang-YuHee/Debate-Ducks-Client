import { useGetDebate } from "../../../utils/queries/debates";
import styles from "./index.module.scss";

import Factchecks from "./Factchecks";
import Vote from "./Vote";

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
      <div className={styles.details}>
        {
          "토론자가 자신 주장의 근거와 상대 주장의 오류를 적는 공간입니다.\n새로운 주장을 적는 공간은 아닙니다."
        }
      </div>
      <Factchecks debateId={debateId} />
      <div className={styles.line}></div>
      <div className={styles.name}>투표</div>
      <div className={styles.details}>
        {
          "투표는 토론을 더 잘한 사람에게 해주세요.\n자신의 의견은 댓글을 통해서 표현해주세요."
        }
      </div>
      <Vote debateId={debateId} />
      <div className={styles.line}></div>
    </>
  ) : null;
}
