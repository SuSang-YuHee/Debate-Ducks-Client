import { useState } from "react";
import Image from "next/image";

import { useGetUser } from "../../../utils/queries/users";
import { useGetDebate } from "../../../utils/queries/debates";
import {
  useDeleteHeart,
  useGetHeart,
  usePostHeart,
} from "../../../utils/queries/hearts";
import { CATEGORIES } from "../../../utils/common/constant";
import { DMYHM } from "../../../utils/common/formatStrDate";
import styles from "./index.module.scss";

import CheckSignInModal from "../../common/modal/CheckSignInModal";
import DebaterInfo from "../DebaterInfo";
import AfterDebate from "./AfterDebate";
import EditAndDelete from "./EditAndDelete";
import { thousandDigit } from "../../../utils/common/thousandDigit";
// import Comments from "./Comments";

export default function Debate({ debateId }: { debateId: number }) {
  const [isCheckModalOn, setIsCheckModalOn] = useState<boolean>(false);

  const user = useGetUser();
  const debate = useGetDebate(debateId);
  const heart = useGetHeart({
    target_debate_id: debateId,
    target_user_id: user.data?.id || "",
  });
  const postHeart = usePostHeart();
  const deleteHeart = useDeleteHeart();

  const handleHeart = () => {
    if (!user.data) {
      setIsCheckModalOn(true);
    } else {
      if (heart.data) {
        deleteHeart.mutate({
          target_debate_id: debateId,
          target_user_id: user.data?.id || "",
        });
      } else {
        postHeart.mutate({
          target_debate_id: debateId,
          target_user_id: user.data?.id || "",
        });
      }
    }
  };

  return (
    <>
      <CheckSignInModal
        isModalOn={isCheckModalOn}
        setIsModalOn={setIsCheckModalOn}
      />
      <div className={styles.outer}>
        <div className={styles.title}>
          <div className={styles.title_bg}>
            <Image
              src={`/images/categories/${CATEGORIES.indexOf(
                debate.data?.category || "기타",
              )}.jpg`}
              alt={`${debate.data?.category || "기타"}`}
              layout="fill"
              objectFit="cover"
              objectPosition="center"
            />
          </div>
          <div className={styles.title_name}>{debate.data?.title}</div>
          <div className={styles.title_date}>
            {debate.data?.updated_date
              ? DMYHM(debate.data?.updated_date || "") + " (수정됨)"
              : DMYHM(debate.data?.created_date || "")}
          </div>
        </div>
        {user.data && user.data.id === debate.data?.author?.id ? (
          <EditAndDelete debateId={debateId} />
        ) : null}
        <div className={styles.debaterInfo}>
          <DebaterInfo
            debateId={debateId}
            isAuthorPros={debate.data?.author_pros || false}
            size={"150"}
          />
          <div className={styles.vs}>VS</div>
          <DebaterInfo
            debateId={debateId}
            isAuthorPros={!debate.data?.author_pros || false}
            size={"150"}
          />
        </div>
        <div
          className={`${styles.heart} ${
            heart.data ? styles.heart_fill : styles.heart_empty
          }`}
          onClick={handleHeart}
        >{`♥︎ ${thousandDigit(
          debate.data?.hearts_cnt || 0,
        )}명이 이 토론를 좋아합니다.`}</div>
        <div className={styles.line}></div>
        <div className={styles.name}>주제 설명</div>
        <pre className={styles.contents}>{debate.data?.contents}</pre>
        <div className={styles.line}></div>
        <AfterDebate debateId={debateId} />
        {/* <Comments debateId={debateId} /> */}
      </div>
    </>
  );
}
