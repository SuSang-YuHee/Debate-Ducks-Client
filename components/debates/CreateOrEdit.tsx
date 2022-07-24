import { Dispatch, RefObject, SetStateAction, useEffect } from "react";

import { CATEGORIES } from "../../utils";

import ErrAndCheckModal from "../common/modal/ErrAndCheckModal";

import { UseInputResult, UseRadioResult, UseSelectResult } from "../../types";

export default function CreateOrEdit({
  isErrModalOn,
  setIsErrModalOn,
  isCancelModalOn,
  setIsCancelModalOn,
  titleRef,
  validateNotice,
  setValidateNotice,
  titleInput,
  categorySelect,
  prosConsRadio,
  contentsInput,
  createOrEdit,
  createOrEditStr,
  routerPush,
}: {
  isErrModalOn: boolean;
  setIsErrModalOn: Dispatch<SetStateAction<boolean>>;
  isCancelModalOn: boolean;
  setIsCancelModalOn: Dispatch<SetStateAction<boolean>>;
  titleRef: RefObject<HTMLInputElement>;
  validateNotice: string;
  setValidateNotice: Dispatch<SetStateAction<string>>;
  titleInput: UseInputResult;
  categorySelect: UseSelectResult;
  prosConsRadio: UseRadioResult;
  contentsInput: UseInputResult;
  createOrEdit: () => void;
  createOrEditStr: string;
  routerPush: () => void;
}) {
  useEffect(() => {
    setValidateNotice("");
  }, [setValidateNotice, titleInput.value]); // dependency에 titleInput.value 필요

  return (
    <div>
      <ErrAndCheckModal
        isErrModalOn={isErrModalOn}
        setIsErrModalOn={setIsErrModalOn}
        isCheckModalOn={isCancelModalOn}
        setIsCheckModalOn={setIsCancelModalOn}
        errMessage={{
          title: `${createOrEditStr} 실패`,
          content: `에러가 발생해 ${createOrEditStr}에 실패했습니다.`,
        }}
        checkMessage={{
          title: `${createOrEditStr} 취소`,
          content: `${createOrEditStr}을 취소하고 나가겠습니까?`,
          firstBtn: "머무르기",
          secondBtn: "나가기",
        }}
        checkCallback={routerPush}
      />
      <div>
        {"제목* "}
        <input {...titleInput.attribute} ref={titleRef} />
        {validateNotice}
      </div>
      <div>
        {"주제* "}
        <select {...categorySelect.attribute}>
          {CATEGORIES.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
      </div>
      <div>
        {"찬반* "}
        <input {...prosConsRadio.attributeTrue} />
        찬성
        <input {...prosConsRadio.attributeFalse} />
        반대
      </div>
      <div>
        {"내용 "}
        <textarea {...contentsInput.attribute} />
      </div>
      <button
        onClick={() => {
          setIsCancelModalOn(true);
        }}
      >
        취소
      </button>
      <button onClick={createOrEdit}>{createOrEditStr}</button>
    </div>
  );
}
