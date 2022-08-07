import Image from "next/image";
import { useRouter } from "next/router";

import { CATEGORIES, STATUSES } from "../../../utils/common/constant";
import { DMYorHM } from "../../../utils/common/formatStrDate";
import { useGetDebate } from "../../../utils/queries/debates";
import { thousandDigit } from "../../../utils/common/thousandDigit";
import styles from "./DebateCard.module.scss";

import DebaterInfo from "../DebaterInfo";

export default function DebateCard({
  debateId,
  status,
}: {
  debateId: number;
  status: string;
}) {
  const debate = useGetDebate(debateId);
  const router = useRouter();

  return (
    <div
      className={styles.card}
      onClick={() => router.push(`/debates/${debate.data?.id}`)}
    >
      <div className={styles.category}>
        <div className={`${styles.status} ${styles.status_category}`}>
          {debate.data?.category}
        </div>
        {status === STATUSES[2] ? (
          <div className={`${styles.status} ${styles.status_vote}`}>
            투표 가능
          </div>
        ) : null}
        <Image
          className={styles.image}
          src={`/images/categories/${CATEGORIES.indexOf(
            debate.data?.category || "기타",
          )}.jpg`}
          alt={`${debate.data?.category}`}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
      </div>
      <div className={styles.debaters}>
        <DebaterInfo
          debateId={debateId}
          isAuthorPros={debate.data?.author_pros || false}
          size={"90"}
        />
        <div className={styles.vs}>VS</div>
        <DebaterInfo
          debateId={debateId}
          isAuthorPros={!debate.data?.author_pros || false}
          size={"90"}
        />
      </div>
      <div className={styles.title}>{debate.data?.title}</div>
      <div className={styles.box}>
        <div className={styles.box_heart}>
          ♥︎ {thousandDigit(debate.data?.hearts_cnt || 0)}
        </div>
        <div className={styles.box_date}>
          {DMYorHM(debate.data?.created_date || "")}
        </div>
      </div>
    </div>
  );
}
