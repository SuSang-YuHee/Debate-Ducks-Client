import Image from "next/image";

import styles from "./DebaterInfo.module.scss";

import { useGetDebate } from "../../utils/queries/debates";

export default function DebaterInfo({
  debateId,
  isAuthorPros,
  size,
}: {
  debateId: number;
  isAuthorPros: boolean;
  size: string;
}) {
  const debate = useGetDebate(debateId);

  return isAuthorPros ? (
    <div className={styles.box}>
      <Image
        className={styles.image}
        src={
          debate.data?.author?.profile_image
            ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${debate.data?.author.profile_image}.jpg`
            : "/images/profiles/default-gray.png"
        }
        alt={debate.data?.author?.nickname || "기본 이미지"}
        width={`${size}`}
        height={`${size}`}
        objectFit="cover"
        objectPosition="center"
      />
      <div
        className={`${styles.nickname} ${
          isAuthorPros === debate.data?.author_pros
            ? styles.nickname_pros
            : styles.nickname_cons
        }`}
      >
        {debate.data?.author?.nickname || "탈퇴한 회원"}
      </div>
    </div>
  ) : (
    <div className={styles.box}>
      <Image
        className={styles.image}
        src={
          debate.data?.participant?.profile_image
            ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${debate.data?.participant.profile_image}.jpg`
            : "/images/profiles/default-gray.png"
        }
        alt={debate.data?.participant?.nickname || "기본 이미지"}
        width={`${size}`}
        height={`${size}`}
        objectFit="cover"
        objectPosition="center"
      />
      <div
        className={`${styles.nickname} ${
          isAuthorPros === debate.data?.author_pros
            ? styles.nickname_pros
            : styles.nickname_cons
        }
        ${
          !debate.data?.participant?.nickname && !debate.data?.video_url
            ? styles.nickname_empty
            : ""
        }`}
      >
        {debate.data?.participant?.nickname ||
          (debate.data?.video_url ? "탈퇴한 회원" : "비어있음")}
      </div>
    </div>
  );
}
