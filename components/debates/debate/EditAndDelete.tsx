import { useRouter } from "next/router";
import { useState } from "react";

import { useDeleteDebate } from "../../../utils/queries/debates";
import ErrorAndCheckModal from "../../common/modal/ErrorAndCheckModal";

export default function EditAndDelete({ debateId }: { debateId: number }) {
  const router = useRouter();

  const [isErrorModalOn, setIsErrorModalOn] = useState<boolean>(false);
  const [isConfirmModal, setIsConfirmModal] = useState<boolean>(false);

  const deleteDebate = useDeleteDebate(setIsErrorModalOn);

  return (
    <div>
      <ErrorAndCheckModal
        isErrorModalOn={isErrorModalOn}
        setIsErrorModalOn={setIsErrorModalOn}
        isCheckModalOn={isConfirmModal}
        setIsCheckModalOn={setIsConfirmModal}
        errorMessage={{
          title: "삭제 실패",
          content: "에러가 발생해 삭제에 실패했습니다.",
        }}
        checkMessage={{
          title: "삭제 확인",
          content: "게시물을 삭제하시겠습니까?",
          firstBtn: "취소하기",
          secondBtn: "삭제하기",
        }}
        checkCallback={() => {
          deleteDebate.mutate(debateId);
        }}
      />
      <button onClick={() => router.push(`/debates/edit/${debateId}`)}>
        편집
      </button>
      <button onClick={() => setIsConfirmModal(true)}>삭제</button>
    </div>
  );
}
