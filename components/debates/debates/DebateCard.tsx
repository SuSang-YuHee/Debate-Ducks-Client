import Image from "next/image";
import { useRouter } from "next/router";

import { CATEGORIES, STATUSES } from "../../../utils/common/constant";
import { DMYorHM } from "../../../utils/common/formatStrDate";
import styles from "./DebateCard.module.scss";

import DebaterOfDebateCard from "./DebaterOfDebateCard";

import { DebateOfDebates } from "../../../types";

export default function DebateCard({
  debate,
  status,
}: {
  debate: DebateOfDebates;
  status: string;
}) {
  const router = useRouter();

  return (
    <div
      className={styles.card}
      onClick={() => router.push(`/debates/${debate.id}`)}
    >
      <div className={styles.category}>
        <div
          className={`${styles.status} ${
            status === STATUSES[0] ? styles.status_0 : ""
          } ${status === STATUSES[1] ? styles.status_1 : ""} ${
            status === STATUSES[2] ? styles.status_2 : ""
          }`}
        >
          {status}
        </div>
        <Image
          className={styles.image}
          src={`/images/categories/${CATEGORIES.indexOf(debate.category)}.jpg`}
          alt={`${debate.category}`}
          layout="fill"
          objectFit="cover"
          objectPosition="center"
        />
      </div>
      <div className={styles.debaters}>
        <DebaterOfDebateCard
          debate={debate}
          isAuthorPros={debate.author_pros}
          isPros={true}
        />
        <div className={styles.vs}>VS</div>
        <DebaterOfDebateCard
          debate={debate}
          isAuthorPros={!debate.author_pros}
          isPros={false}
        />
      </div>
      <div className={styles.title}>{debate.title}</div>
      <div className={styles.box}>
        <div className={styles.box_heart}>♥︎ {debate.hearts_cnt}</div>
        <div className={styles.box_date}>{DMYorHM(debate.created_date)}</div>
      </div>
    </div>
  );
}
