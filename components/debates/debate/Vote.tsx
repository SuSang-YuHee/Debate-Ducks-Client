import { useState } from "react";

import { useGetDebate } from "../../../utils/queries/debates";
import { useGetUser } from "../../../utils/queries/users";
import {
  useGetVote,
  usePatchVote,
  usePostVote,
} from "../../../utils/queries/votes";
import styles from "./Vote.module.scss";

import CheckSignInModal from "../../common/modal/CheckSignInModal";

export default function Vote({ debateId }: { debateId: number }) {
  const [isCheckModalOn, setIsCheckModalOn] = useState<boolean>(false);

  const user = useGetUser();
  const debate = useGetDebate(debateId);
  const vote = useGetVote(
    {
      target_debate_id: debateId,
      target_user_id: user.data?.id || "",
    },
    {
      enabled: !!user.data?.id,
    },
  );
  const postVote = usePostVote();
  const patchVote = usePatchVote();

  const handleVote = (isPros: boolean) => {
    if (!user.data) {
      setIsCheckModalOn(true);
    } else if (vote.data?.isVote) {
      patchVote.mutate({
        target_debate_id: debateId,
        target_user_id: user.data?.id || "",
        pros: isPros,
      });
    } else {
      postVote.mutate({
        target_debate_id: debateId,
        target_user_id: user.data?.id || "",
        pros: isPros,
      });
    }
  };

  const calcPercent = (cnt: number) => {
    return (
      (cnt /
        ((debate.data?.vote.prosCnt || 0) + (debate.data?.vote.consCnt || 0))) *
      100
    );
  };

  return (
    <>
      <CheckSignInModal
        isModalOn={isCheckModalOn}
        setIsModalOn={setIsCheckModalOn}
      />
      <div className={styles.box_vote}>
        {vote.data?.isVote && vote.data?.pros ? (
          <div className={`${styles.btn} ${styles.btn_pros_clicked}`}>✓</div>
        ) : (
          <div
            className={`${styles.btn} ${styles.btn_pros}`}
            onClick={() => handleVote(true)}
          >
            찬성
          </div>
        )}
        {vote.data?.isVote && !vote.data?.pros ? (
          <div className={`${styles.btn} ${styles.btn_cons_clicked}`}>✓</div>
        ) : (
          <div
            className={`${styles.btn} ${styles.btn_cons}`}
            onClick={() => handleVote(false)}
          >
            반대
          </div>
        )}
      </div>
      <div className={styles.box_result}>
        <div className={styles.box_chart}>
          <div
            className={`${styles.chart} ${styles.chart_pros} ${
              calcPercent(debate.data?.vote.prosCnt || 0) === 100
                ? styles.chart_100
                : ""
            }`}
            style={{ width: `${calcPercent(debate.data?.vote.prosCnt || 0)}%` }}
          ></div>
          <div
            className={`${styles.chart} ${styles.chart_cons} ${
              calcPercent(debate.data?.vote.consCnt || 0) === 100
                ? styles.chart_100
                : ""
            }`}
            style={{ width: `${calcPercent(debate.data?.vote.consCnt || 0)}%` }}
          ></div>
        </div>
        <div className={styles.box_cnt}>
          <div>{`찬성 ${calcPercent(debate.data?.vote.prosCnt || 0).toFixed(
            2,
          )}% (${debate.data?.vote.prosCnt}표)`}</div>
          <div>{`반대 ${calcPercent(debate.data?.vote.consCnt || 0).toFixed(
            2,
          )}% (${debate.data?.vote.consCnt}표)`}</div>
        </div>
      </div>
    </>
  );
}
