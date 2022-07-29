import { Dispatch, SetStateAction } from "react";

import { useInput } from "../../../utils/common/useInputSelect";
import { login } from "../../../api/users";
import { useGetUser } from "../../../utils/queries/users";
import styles from "./SignInModal.module.scss";

export default function SignInModal({
  setIsFirstModalOn,
  setIsSecondModalOn,
}: {
  setIsFirstModalOn: Dispatch<SetStateAction<boolean>>;
  setIsSecondModalOn: Dispatch<SetStateAction<boolean>>;
}) {
  const emailInput = useInput("", "");
  const passwordInput = useInput("", "");

  const user = useGetUser();

  const closeModal = () => {
    setIsFirstModalOn(false);
    setIsSecondModalOn(false);
    user.refetch();
  };

  return (
    <div className={styles.outer}>
      <div className={styles.modal}>
        <div className={styles.title}>로그인</div>
        <div className={styles.container}>
          <div className={styles.content}>이메일</div>
          <input className={styles.input} {...emailInput.attribute} />
        </div>
        <div className={styles.container}>
          <div className={styles.content}>비밀번호</div>
          <input
            className={styles.input}
            {...passwordInput.attribute}
            type="password"
          />
        </div>
        <div className={styles.container}>
          <div
            className={`${styles.btn} ${styles.btn_cons}`}
            onClick={() => {
              closeModal();
            }}
          >
            취소하기
          </div>
          <div
            className={`${styles.btn} ${styles.btn_pros}`}
            onClick={() => {
              login(emailInput.value, passwordInput.value, closeModal);
            }}
          >
            로그인
          </div>
        </div>
      </div>
    </div>
  );
}
