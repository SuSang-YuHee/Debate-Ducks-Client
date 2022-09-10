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
      <div
        className={`${styles.image_box} ${
          isAuthorPros === debate.data?.author_pros
            ? styles.image_box_pros
            : styles.image_box_cons
        }`}
      >
        <Image
          className={styles.image}
          src={
            debate.data?.author?.profile_image
              ? debate.data?.author?.profile_image !== "temp default image"
                ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${debate.data?.author.profile_image}`
                : "/images/profiles/default-green.webp"
              : "/images/profiles/default-gray.webp"
          }
          alt={debate.data?.author?.nickname || "탈퇴한 회원"}
          width={`${size}`}
          height={`${size}`}
          objectFit="cover"
          objectPosition="center"
          priority={true}
          unoptimized
        />
      </div>
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
      <div
        className={`${styles.image_box} ${
          isAuthorPros === debate.data?.author_pros
            ? styles.image_box_pros
            : styles.image_box_cons
        }`}
      >
        <Image
          className={styles.image}
          src={
            debate.data?.participant?.profile_image
              ? debate.data?.participant?.profile_image !== "temp default image"
                ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${debate.data?.participant.profile_image}`
                : "/images/profiles/default-green.webp"
              : "/images/profiles/default-gray.webp"
          }
          alt={debate.data?.participant?.nickname || "탈퇴한 회원"}
          width={`${size}`}
          height={`${size}`}
          objectFit="cover"
          objectPosition="center"
          priority={true}
          unoptimized
        />
      </div>
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
