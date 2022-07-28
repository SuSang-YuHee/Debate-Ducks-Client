import { useRouter } from "next/router";
import { Dispatch, SetStateAction, useState } from "react";

import { useGetUser } from "../../../utils/queries/users";
import ConfirmModal from "../../common/modal/ConfirmModal";
import styles from "./LikeBtn.module.scss";

export default function LikeBtn({
  isHeartListOn,
  setIsHeartListOn,
}: {
  isHeartListOn: boolean;
  setIsHeartListOn: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const [isModalOn, setIsModalOn] = useState<boolean>(false);

  const user = useGetUser();

  return (
    <>
      {isModalOn ? (
        <ConfirmModal
          title={`로그인이 필요한 서비스입니다.`}
          content={`로그인을 하고 서비스를 이용하시겠습니까?`}
          firstBtn={"아니요"}
          firstFunc={() => {
            setIsModalOn(false);
          }}
          secondBtn={"로그인하기"}
          secondFunc={() => router.push("/signin")}
        />
      ) : null}
      <div className={styles.outer}>
        {isHeartListOn ? (
          <div
            className={`${styles.btn} ${styles.btn_clicked}`}
            onClick={() => setIsHeartListOn(false)}
          >
            ♥︎ 좋아요한 토론만 보기
          </div>
        ) : (
          <div
            className={styles.btn}
            onClick={() => {
              if (user.data) {
                setIsHeartListOn(true);
              } else {
                setIsModalOn(true);
              }
            }}
          >
            ♡ 좋아요한 토론만 보기
          </div>
        )}
      </div>
    </>
  );
}
