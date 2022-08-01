import Image from "next/image";

import styles from "./DebaterInfo.module.scss";

import { DebateOfDebates } from "../../types";

export default function DebaterInfo({
  debate,
  isAuthorPros,
  size,
}: {
  debate: DebateOfDebates;
  isAuthorPros: boolean;
  size: string;
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
        width={`${size}`}
        height={`${size}`}
        objectFit="cover"
        objectPosition="center"
      />
      <div
        className={`${styles.nickname} ${
          isAuthorPros === debate.author_pros
            ? styles.nickname_pros
            : styles.nickname_cons
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
        width={`${size}`}
        height={`${size}`}
        objectFit="cover"
        objectPosition="center"
      />
      <div
        className={`${styles.nickname} ${
          isAuthorPros === debate.author_pros
            ? styles.nickname_pros
            : styles.nickname_cons
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
