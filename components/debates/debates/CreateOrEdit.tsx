import { Dispatch, RefObject, SetStateAction } from "react";

import { CATEGORIES } from "../../../utils/common/constant";

import ConfirmModal from "../../common/modal/ConfirmModal";

import {
  UseInputResult,
  UseRadioResult,
  UseSelectResult,
} from "../../../types";

export default function CreateOrEdit({
  isCancelModalOn,
  setIsCancelModalOn,
  titleRef,
  titleInput,
  categorySelect,
  prosConsRadio,
  contentsInput,
  createOrEdit,
  createOrEditStr,
  routerPush,
}: {
  isCancelModalOn: boolean;
  setIsCancelModalOn: Dispatch<SetStateAction<boolean>>;
  titleRef: RefObject<HTMLInputElement>;
  titleInput: UseInputResult;
  categorySelect: UseSelectResult;
  prosConsRadio: UseRadioResult;
  contentsInput: UseInputResult;
  createOrEdit: () => void;
  createOrEditStr: string;
  routerPush: () => void;
}) {
  return (
    <div>
      {isCancelModalOn ? (
        <ConfirmModal
          title={`${createOrEditStr} 취소`}
          content={`${createOrEditStr}을 취소하고 나가겠습니까?`}
          firstBtn={"머무르기"}
          firstFunc={() => {
            setIsCancelModalOn(false);
          }}
          secondBtn={"나가기"}
          secondFunc={routerPush}
        />
      ) : null}
      <div>
        {"제목* "}
        <input {...titleInput.attribute} ref={titleRef} />
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
