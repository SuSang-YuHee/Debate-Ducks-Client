import styles from "./ConfirmModal.module.scss";

export default function ConfirmModal({
  title,
  content,
  firstBtn,
  firstFunc,
  secondBtn,
  secondFunc,
}: {
  title: string;
  content: string;
  firstBtn: string;
  firstFunc: () => void;
  secondBtn?: string;
  secondFunc?: () => void;
}) {
  const handleCancel = () => {
    firstFunc();
  };

  const handleConfirm = () => {
    if (secondFunc) secondFunc();
  };

  return (
    <div className={styles.outer}>
      <div className={styles.modal}>
        <div className={styles.title}>{title}</div>
        <div className={styles.content}>{content}</div>
        {secondBtn ? (
          <div className={styles.container}>
            <div
              className={`${styles.btn} ${styles.btn_cons}`}
              onClick={handleCancel}
            >
              {firstBtn}
            </div>
            <div
              className={`${styles.btn} ${styles.btn_pros}`}
              onClick={handleConfirm}
            >
              {secondBtn}
            </div>
          </div>
        ) : (
          <div>
            <div
              className={`${styles.btn} ${styles.btn_pros}`}
              onClick={handleCancel}
            >
              {firstBtn}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
