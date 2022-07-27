import { useRouter } from "next/router";
import { useState } from "react";

import { useDeleteDebate } from "../../../utils/queries/debates";
import ConfirmModal from "../../common/modal/ConfirmModal";

export default function EditAndDelete({ debateId }: { debateId: number }) {
  const router = useRouter();
  const [isDeleteModalOn, setIsDeleteModalOn] = useState<boolean>(false);

  const deleteDebate = useDeleteDebate();

  return (
    <div>
      {isDeleteModalOn ? (
        <ConfirmModal
          title={"삭제 확인"}
          content={"게시물을 삭제하시겠습니까?"}
          firstBtn={"취소하기"}
          firstFunc={() => {
            setIsDeleteModalOn(false);
          }}
          secondBtn={"삭제하기"}
          secondFunc={() => deleteDebate.mutate(debateId)}
        />
      ) : null}
      <button onClick={() => router.push(`/debates/edit/${debateId}`)}>
        편집
      </button>
      <button onClick={() => setIsDeleteModalOn(true)}>삭제</button>
    </div>
  );
}
