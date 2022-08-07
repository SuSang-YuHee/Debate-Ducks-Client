import { useRouter } from "next/router";
import { useState } from "react";
import Image from "next/image";

import { useGetUser } from "../../../utils/queries/users";
import { useGetDebate, usePatchDebate } from "../../../utils/queries/debates";
import {
  useDeleteHeart,
  useGetHeart,
  usePostHeart,
} from "../../../utils/queries/hearts";
import { CATEGORIES } from "../../../utils/common/constant";
import { DMYHM } from "../../../utils/common/formatStrDate";
import { thousandDigit } from "../../../utils/common/thousandDigit";
import styles from "./index.module.scss";

import CheckSignInModal from "../../common/modal/CheckSignInModal";
import HomeAndTopBtn from "../../common/btn/HomeAndTopBtn";
import DebaterInfo from "../DebaterInfo";
import AfterDebate from "./AfterDebate";
import EditAndDelete from "./EditAndDelete";
import Comments from "./Comments";

export default function Debate({ debateId }: { debateId: number }) {
  const router = useRouter();
  const [isCheckModalOn, setIsCheckModalOn] = useState<boolean>(false);

  const user = useGetUser();
  const debate = useGetDebate(debateId);
  const heart = useGetHeart(
    {
      target_debate_id: debateId,
      target_user_id: user.data?.id || "",
    },
    {
      enabled: !!user.data?.id,
    },
  );
  const patchDebate = usePatchDebate(debateId, user.data);
  const postHeart = usePostHeart();
  const deleteHeart = useDeleteHeart();

  const handleParticipant = () => {
    if (!user.data) {
      setIsCheckModalOn(true);
    } else {
      patchDebate.mutate({ id: debateId, participant_id: user.data.id });
    }
  };

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
      <HomeAndTopBtn isHomeBtnOn={true} />
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
        {user.data &&
        user.data.id === debate.data?.author?.id &&
        !debate.data.participant ? (
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
        {!debate.data?.video_url &&
        !debate.data?.participant &&
        debate.data?.author?.id !== user.data?.id ? (
          <div
            className={styles.participantOrEnterBtn}
            onClick={handleParticipant}
          >
            참여하기
          </div>
        ) : debate.data?.video_url &&
          debate.data?.participant &&
          user.data &&
          (debate.data?.author?.id === user.data?.id ||
            debate.data?.participant?.id) ? (
          <div
            className={styles.participantOrEnterBtn}
            onClick={() => router.push(`/debateroom/${debateId}`)}
          >
            입장하기
          </div>
        ) : null}
        <div
          className={`${styles.heart} ${
            heart.data ? styles.heart_fill : styles.heart_empty
          }`}
          onClick={handleHeart}
        >{`♥︎ ${thousandDigit(
          debate.data?.hearts_cnt || 0,
        )}명이 이 토론를 좋아합니다.`}</div>
        <div className={styles.line}></div>
        {debate.data?.contents ? (
          <>
            <div className={styles.name}>주제 설명</div>
            <pre className={styles.contents}>{debate.data?.contents}</pre>
            <div className={styles.line}></div>
          </>
        ) : null}
        <AfterDebate debateId={debateId} />
        <div className={styles.name}>댓글</div>
        <Comments debateId={debateId} />
      </div>
    </>
  );
}
