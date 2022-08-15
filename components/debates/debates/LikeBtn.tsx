import { useState } from "react";

import { useGetUser } from "../../../utils/queries/users";
import styles from "./LikeBtn.module.scss";

import CheckSignInModal from "../../common/modal/CheckSignInModal";

export default function LikeBtn({
  isHeartListOn,
  setIsHeartListOn,
}: {
  isHeartListOn: boolean;
  setIsHeartListOn: (params: boolean) => void;
}) {
  const [isModalOn, setIsModalOn] = useState<boolean>(false);

  const user = useGetUser();

  return (
    <>
      <CheckSignInModal isModalOn={isModalOn} setIsModalOn={setIsModalOn} />
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
