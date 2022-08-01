import Image from "next/image";

import styles from "./DebaterOfDebateCard.module.scss";

import { DebateOfDebates } from "../../../types";

export default function DebaterOfDebateCard({
  debate,
  isAuthorPros,
  isPros,
}: {
  debate: DebateOfDebates;
  isAuthorPros: boolean;
  isPros: boolean;
}) {
  return isAuthorPros ? (
    <div className={styles.box}>
      <Image
        className={styles.image}
        src={
          debate.author?.profile_image
            ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${debate.author.profile_image}.jpg`
            : "/images/profiles/default-gray.png"
        }
        alt={debate.author?.nickname || "기본 이미지"}
        width="90%"
        height="90%"
        objectFit="cover"
      />
      <div
        className={`${styles.nickname} ${
          isPros ? styles.nickname_pros : styles.nickname_cons
        }`}
      >
        {debate.author?.nickname || "탈퇴한 회원"}
      </div>
    </div>
  ) : (
    <div className={styles.box}>
      <Image
        className={styles.image}
        src={
          debate.participant?.profile_image
            ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${debate.participant.profile_image}.jpg`
            : "/images/profiles/default-gray.png"
        }
        alt={debate.participant?.nickname || "기본 이미지"}
        width="90%"
        height="90%"
        objectFit="cover"
      />
      <div
        className={`${styles.nickname} ${
          isPros ? styles.nickname_pros : styles.nickname_cons
        }
        ${
          !debate.participant?.nickname && !debate.video_url
            ? styles.nickname_empty
            : ""
        }`}
      >
        {debate.participant?.nickname ||
          (debate.video_url ? "탈퇴한 회원" : "비어있음")}
      </div>
    </div>
  );
}
