import { useRef, useState } from "react";

import { useGetDebate } from "../../../utils/queries/debates";
import {
  useDeleteFactcheck,
  usePatchFactcheck,
  usePostFactcheck,
} from "../../../utils/queries/factchecks";

import ConfirmModal from "../../common/modal/ConfirmModal";
import ErrAndCheckModal from "../../common/modal/ErrAndCheckModal";

import { FactcheckPatch, FactcheckPost } from "../../../types";
import { useInput } from "../../../utils/useInputSelect";

export default function Factchecks({ debateId }: { debateId: number }) {
  const [isCreateErrModalOn, setIsCreateErrModalOn] = useState<boolean>(false);
  const [isEditErrModalOn, setIsEditErrModalOn] = useState<boolean>(false);
  const [isEditOn, setIsEditOn] = useState<boolean>(false);
  const [isDeleteErrModalOn, setIsDeleteErrModalOn] = useState<boolean>(false);
  const [isDeleteConfirmModalOn, setIsDeleteConfirmModalOn] =
    useState<boolean>(false);

  const debate = useGetDebate(debateId);
  const postFactcheck = usePostFactcheck(debateId, setIsCreateErrModalOn);
  const patchFactcheck = usePatchFactcheck(debateId, setIsEditErrModalOn);
  const deleteFactcheck = useDeleteFactcheck(debateId, setIsDeleteErrModalOn);
  const factcheckIdRef = useRef<number>(0);

  const referencePostInput = useInput("", "");
  const descriptionPostInput = useInput("", "");
  const referencePatchInput = useInput("", "");
  const descriptionPatchInput = useInput("", "");

  const factcheckPost: FactcheckPost = {
    target_debate_id: debateId,
    target_user_id: "01G85SA6V8NXD7XGB155SC4S18",
    pros: true,
    description: descriptionPostInput.value,
    reference_url: referencePostInput.value,
  };

  const factcheckPatch: Omit<FactcheckPatch, "id"> = {
    description: descriptionPatchInput.value,
    reference_url: referencePatchInput.value,
  };

  return (
    <>
      {isCreateErrModalOn ? (
        <ConfirmModal
          title="작성 실패"
          content="작성에 실패했습니다. 다시 한번 확인해 주세요."
          firstBtn="확인"
          firstFunc={() => {
            setIsCreateErrModalOn(false);
          }}
        />
      ) : null}
      {isEditErrModalOn ? (
        <ConfirmModal
          title="수정 실패"
          content="수정에 실패했습니다. 다시 한번 확인해 주세요."
          firstBtn="확인"
          firstFunc={() => {
            setIsEditErrModalOn(false);
          }}
        />
      ) : null}
      <ErrAndCheckModal
        isErrModalOn={isDeleteErrModalOn}
        setIsErrModalOn={setIsDeleteErrModalOn}
        isCheckModalOn={isDeleteConfirmModalOn}
        setIsCheckModalOn={setIsDeleteConfirmModalOn}
        errMessage={{
          title: "삭제 실패",
          content: "에러가 발생해 삭제에 실패했습니다.",
        }}
        checkMessage={{
          title: "삭제 확인",
          content: "삭제하시겠습니까?",
          firstBtn: "취소하기",
          secondBtn: "삭제하기",
        }}
        checkCallback={() => {
          deleteFactcheck.mutate(factcheckIdRef.current);
          setIsDeleteConfirmModalOn(false);
        }}
      />
      {debate.data?.factchecks
        .filter((factcheck) => factcheck.pros)
        .map((factcheck) => (
          <div key={factcheck.id}>
            {isEditOn && factcheckIdRef.current === factcheck.id ? (
              <div>
                {"참조: "}
                <input {...descriptionPatchInput.attribute} />
                {"주소: "}
                <input {...referencePatchInput.attribute} />
                <button onClick={() => setIsEditOn(false)}>취소</button>
                <button
                  onClick={() => {
                    patchFactcheck.mutate({
                      ...factcheckPatch,
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
                    factcheckIdRef.current = factcheck.id;
                    descriptionPatchInput.setValue(factcheck.description);
                    referencePatchInput.setValue(factcheck.reference_url);
                    setIsEditOn(true);
                  }}
                >
                  수정
                </button>
              </div>
            )}
            <button
              onClick={() => {
                factcheckIdRef.current = factcheck.id;
                setIsDeleteConfirmModalOn(true);
              }}
            >
              삭제
            </button>
          </div>
        ))}
      {debate.data?.factchecks.filter((factcheck) => !factcheck.pros)}
      {"참조: "}
      <input {...descriptionPostInput.attribute} />
      {"주소: "}
      <input {...referencePostInput.attribute} />
      <button
        onClick={() => {
          postFactcheck.mutate(factcheckPost);
          referencePostInput.setValue("");
          descriptionPostInput.setValue("");
        }}
      >
        작성
      </button>
    </>
  );
}
