import { useState } from "react";

import { useGetDebate } from "../../../utils/queries/debates";
import {
  useDeleteFactcheck,
  usePatchFactcheck,
  usePostFactcheck,
} from "../../../utils/queries/factchecks";
import { useInput } from "../../../utils/useInputSelect";

import ConfirmModal from "../../common/modal/ConfirmModal";

export default function Factchecks({ debateId }: { debateId: number }) {
  const [isEditOn, setIsEditOn] = useState<boolean>(false);
  const [isDeleteModalOn, setIsDeleteModalOn] = useState<boolean>(false);
  const [factcheckId, setFactcheckId] = useState<number>(0);

  const debate = useGetDebate(debateId);
  const postFactcheck = usePostFactcheck(debateId);
  const patchFactcheck = usePatchFactcheck(debateId);
  const deleteFactcheck = useDeleteFactcheck(debateId);

  const referenceCreateInput = useInput("", "");
  const descriptionCreateInput = useInput("", "");
  const referenceEditInput = useInput("", "");
  const descriptionEdithInput = useInput("", "");

  return (
    <>
      {isDeleteModalOn ? (
        <ConfirmModal
          title={"삭제 확인"}
          content={"게시물을 삭제하시겠습니까?"}
          firstBtn={"취소하기"}
          firstFunc={() => {
            setIsDeleteModalOn(false);
          }}
          secondBtn={"삭제하기"}
          secondFunc={() => {
            deleteFactcheck.mutate(factcheckId);
            setIsDeleteModalOn(false);
          }}
        />
      ) : null}
      {debate.data?.factchecks
        .filter((factcheck) => factcheck.pros)
        .map((factcheck) => (
          <div key={factcheck.id}>
            {isEditOn && factcheckId === factcheck.id ? (
              <div>
                {"참조: "}
                <input {...descriptionEdithInput.attribute} />
                {"주소: "}
                <input {...referenceEditInput.attribute} />
                <button onClick={() => setIsEditOn(false)}>취소</button>
                <button
                  onClick={() => {
                    patchFactcheck.mutate({
                      description: descriptionEdithInput.value,
                      reference_url: referenceEditInput.value,
                      id: factcheck.id,
                    });
                    setIsEditOn(false);
                  }}
                >
                  수정
                </button>
              </div>
            ) : (
              <div>
                <p>{factcheck.description}</p>
                <a href={factcheck.reference_url}>{factcheck.reference_url}</a>
                <button
                  onClick={() => {
                    setFactcheckId(factcheck.id);
                    descriptionEdithInput.setValue(factcheck.description);
                    referenceEditInput.setValue(factcheck.reference_url);
                    setIsEditOn(true);
                  }}
                >
                  수정
                </button>
              </div>
            )}
            <button
              onClick={() => {
                setFactcheckId(factcheck.id);
                setIsDeleteModalOn(true);
              }}
            >
              삭제
            </button>
          </div>
        ))}
      {debate.data?.factchecks.filter((factcheck) => !factcheck.pros)}
      {"참조: "}
      <input {...descriptionCreateInput.attribute} />
      {"주소: "}
      <input {...referenceCreateInput.attribute} />
      <button
        onClick={() => {
          postFactcheck.mutate({
            target_debate_id: debateId,
            target_user_id: "01G85SA6V8NXD7XGB155SC4S18",
            pros: true,
            description: descriptionCreateInput.value,
            reference_url: referenceCreateInput.value,
          });
          referenceCreateInput.setValue("");
          descriptionCreateInput.setValue("");
        }}
      >
        작성
      </button>
    </>
  );
}
