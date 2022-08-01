import { toast } from "react-hot-toast";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

import { CATEGORIES } from "../../utils/common/constant";
import { removeSpace } from "../../utils/common/removeSpace";
import styles from "./CreateOrEdit.module.scss";

import ConfirmModal from "../common/modal/ConfirmModal";

import { UseInputResult, UseRadioResult, UseSelectResult } from "../../types";

export default function CreateOrEdit({
  isCancelModalOn,
  setIsCancelModalOn,
  titleInput,
  categorySelect,
  prosConsRadio,
  contentsInput,
  handler,
  createOrEdit,
  routerPush,
}: {
  isCancelModalOn: boolean;
  setIsCancelModalOn: Dispatch<SetStateAction<boolean>>;
  titleInput: UseInputResult;
  categorySelect: UseSelectResult;
  prosConsRadio: UseRadioResult;
  contentsInput: UseInputResult;
  handler: () => void;
  createOrEdit: string;
  routerPush: () => void;
}) {
  const createOrEditTitle =
    createOrEdit === "작성" ? "토론 만들기" : "토론 수정하기";
  const details =
    createOrEdit === "작성"
      ? "찬반 의견이 확실히 갈리는 주제로 토론을 만들어 주세요.\n내용은 해당 주제의 쟁점을 위주로 적어주세요."
      : "";

  const titleRef = useRef<HTMLInputElement>(null);
  const contentsRef = useRef<HTMLTextAreaElement>(null);
  const [titleCnt, setTitleCnt] = useState<number>(titleInput.value.length);
  const [contentsCnt, setContentsCnt] = useState<number>(
    contentsInput.value.length,
  );
  const [validateMsg, setValidateMsg] = useState<string>();
  const [isTitleFail, setIsTitleFail] = useState<boolean>(false);
  const [isContentsFail, setIsContentsFail] = useState<boolean>(false);

  useEffect(() => {
    const title = removeSpace(titleInput.value);
    setTitleCnt(title.length);
    if (title.length < 5 || title.length > 50) {
      setIsTitleFail(true);
    } else {
      setIsTitleFail(false);
    }
    if (/[^\s\wㄱ-ㅎㅏ-ㅣ가-힣.,!?%&()]/.test(title) || title.length === 0) {
      setValidateMsg(
        "*낱자를 제외한 한글, 영어, 숫자 및 특수문자【.,!?%&()_】만 포함 가능합니다.",
      );
    } else {
      setValidateMsg("");
    }
  }, [titleInput.value]);

  useEffect(() => {
    const contents = removeSpace(contentsInput.value);
    setContentsCnt(contents.length);
    if (contents.length > 3000) {
      setIsContentsFail(true);
    } else {
      setIsContentsFail(false);
    }
  }, [contentsInput.value]);

  const handleCreateOrEdit = () => {
    if (isTitleFail) {
      toast.error("제목은 5자 이상, 50자 이하여야 합니다.");
      titleRef.current?.focus();
      return;
    }
    if (/[ㄱ-ㅎㅏ-ㅣ]/.test(removeSpace(titleInput.value))) {
      toast.error("제목에 낱자는 포함할 수 없습니다.");
      titleRef.current?.focus();
      return;
    }
    if (/[^\s\w가-힣.,!?%&()]/.test(removeSpace(titleInput.value))) {
      toast.error(
        "제목은 낱자를 제외한 한글, 영어, 숫자 및 일부 특수문자만 포함 가능합니다.",
      );
      titleRef.current?.focus();
      return;
    }
    if (isContentsFail) {
      toast.error("내용은 3000자 이하여야 합니다.");
      contentsRef.current?.focus();
      return;
    }
    handler();
  };

  return (
    <>
      {isCancelModalOn ? (
        <ConfirmModal
          title={`${createOrEdit} 취소`}
          content={`${createOrEdit}을 취소하고 나가시겠습니까?\n${createOrEdit}한 내용은 저장되지 않습니다.`}
          firstBtn={"머무르기"}
          firstFunc={() => {
            setIsCancelModalOn(false);
          }}
          secondBtn={"나가기"}
          secondFunc={routerPush}
        />
      ) : null}
      <div className={styles.outer}>
        <div className={styles.box}>
          <div className={styles.createOrEdit}>{createOrEditTitle}</div>
          <pre className={styles.details}>{details}</pre>
          <div className={styles.small_box}>
            <div className={styles.name}>제목</div>
            <input
              className={styles.title}
              ref={titleRef}
              {...titleInput.attribute}
            />
            <div className={styles.validator}>
              <div className={styles.message}>{validateMsg}</div>
              <div
                className={`${styles.count} ${
                  isTitleFail ? styles.count_fail : ""
                }`}
              >
                {titleCnt} / 50
              </div>
            </div>
            <div className={styles.name}>분류</div>
            <select className={styles.category} {...categorySelect.attribute}>
              {CATEGORIES.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
            <div>
              <div className={styles.name}>찬성∙반대</div>
              <div className={styles.radio_box}>
                <label className={styles.label}>
                  <input
                    className={styles.radio}
                    {...prosConsRadio.attributeTrue}
                  />
                  <div className={styles.radio_name}>찬성</div>
                </label>
                <label className={styles.label}>
                  <input
                    className={styles.radio}
                    {...prosConsRadio.attributeFalse}
                  />
                  <div className={styles.radio_name}>반대</div>
                </label>
              </div>
            </div>
            <div className={styles.name}>내용</div>
            <textarea
              className={styles.contents}
              ref={contentsRef}
              {...contentsInput.attribute}
            />
            <div className={styles.validator}>
              <div className={styles.message}>{""}</div>
              <div
                className={`${styles.count} ${
                  isContentsFail ? styles.count_fail : ""
                }`}
              >
                {contentsCnt} / 3000
              </div>
            </div>
            <div className={styles.btn_box}>
              <div
                className={`${styles.btn} ${styles.btn_cancel}`}
                onClick={() => {
                  setIsCancelModalOn(true);
                }}
              >
                취소
              </div>
              <div
                className={`${styles.btn} ${styles.btn_confirm}`}
                onClick={handleCreateOrEdit}
              >
                {createOrEdit}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
