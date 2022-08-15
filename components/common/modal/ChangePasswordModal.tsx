import { BaseSyntheticEvent, useState } from "react";
import { useGetUser, usePatchUserPassword } from "../../../utils/queries/users";
import styles from "./ChangePasswordModal.module.scss";

export default function ChangePasswordModal({
  cancelFunc,
}: {
  cancelFunc: () => void;
}) {
  const [prevPassword, setPrevPassword] = useState("");
  const [nextPassword, setNextPassword] = useState("");

  const user = useGetUser();
  const patchUserPassword = usePatchUserPassword(
    user.data?.id || "",
    prevPassword,
    nextPassword,
  );

  const handleChangePrevPassword = (e: BaseSyntheticEvent) => {
    setPrevPassword(e.target.value);
  };

  const handleChangeNextPassword = (e: BaseSyntheticEvent) => {
    setNextPassword(e.target.value);
  };

  const handleSaveNextPassword = () => {
    patchUserPassword.mutate();
    cancelFunc();
  };
  return (
    <div className={styles.outer}>
      <div className={styles.modal}>
        <div className={styles.title}>비밀번호 변경</div>
        <div className={styles.container}>
          <div className={styles.content}>현재 비밀번호</div>
          <input
            className={styles.input}
            type="password"
            onChange={handleChangePrevPassword}
          />
        </div>
        <div className={styles.container}>
          <div className={styles.content}>새 비밀번호</div>
          <input
            className={styles.input}
            type="password"
            onChange={handleChangeNextPassword}
          />
        </div>
        <div className={styles.container}>
          <div
            className={`${styles.btn} ${styles.btn_cons}`}
            onClick={cancelFunc}
          >
            취소하기
          </div>
          <div
            className={`${styles.btn} ${styles.btn_pros}`}
            onClick={handleSaveNextPassword}
          >
            비밀번호 변경
          </div>
        </div>
      </div>
    </div>
  );
}
