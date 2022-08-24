import { useRouter } from "next/router";
import { useState } from "react";

import { useDeleteDebate } from "../../../utils/queries/debates";
import styles from "./EditAndDelete.module.scss";

import ConfirmModal from "../../common/modal/ConfirmModal";

export default function EditAndDelete({ debateId }: { debateId: number }) {
  const router = useRouter();
  const [isDeleteModalOn, setIsDeleteModalOn] = useState<boolean>(false);

  const deleteDebate = useDeleteDebate();

  return (
    <div className={styles.editAndDelete}>
      {isDeleteModalOn ? (
        <ConfirmModal
          title={"토론 삭제"}
          content={
            "토론을 삭제하시겠습니까?\n삭제한 토론은 복구할 수 없습니다."
          }
          firstBtn={"취소하기"}
          firstFunc={() => {
            setIsDeleteModalOn(false);
          }}
          secondBtn={"삭제하기"}
          secondFunc={() => deleteDebate.mutate(debateId)}
        />
      ) : null}
      <div
        className={styles.edit}
        onClick={() => router.push(`/edit?debateId=${debateId}`)}
      >
        수정
      </div>
      <div className={styles.delete} onClick={() => setIsDeleteModalOn(true)}>
        삭제
      </div>
    </div>
  );
}
