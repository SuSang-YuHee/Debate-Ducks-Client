import Image from "next/image";

import { CATEGORIES } from "../../../utils/common/constant";
import styles from "./DebateCard.module.scss";

import Debater from "./Debater";

import { DebateOfDebates } from "../../../types";

export default function DebateCard({
  debate,
  status,
}: {
  debate: DebateOfDebates;
  status: string;
}) {
  console.log(status);

  return (
    <div className={styles.card}>
      <div className={styles.category}>
        <Image
          className={styles.image}
          src={`/images/categories/${CATEGORIES.indexOf(debate.category)}.jpg`}
          alt={`${debate.category}`}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className={styles.debaters}>
        <Debater
          debate={debate}
          isAuthorPros={debate.author_pros}
          isPros={true}
        />
        <div className={styles.vs}>VS</div>
        <Debater
          debate={debate}
          isAuthorPros={!debate.author_pros}
          isPros={false}
        />
      </div>
    </div>
  );
}
