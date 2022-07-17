import { useRef, useState } from "react";
import axios from "axios";
import router from "next/router";

import { useInput, useRadio, useSelect } from "../../utils/useInputSelect";
import { CATEGORIES } from "../../utils";

import { IDebateInfo } from "../../types";
import ConfirmModal from "../../components/common/modal/ConfirmModal";

export default function Create() {
  //Todo: Create랑 Edit로 구분되는 컴포넌트로 만들어야함
  const [isErrModalOn, setIsErrModalOn] = useState<boolean>(false);
  const [isCancelModalOn, setIsCancelModalOn] = useState<boolean>(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const [validateNotice, setValidateNotice] = useState<string>("");

  const titleInput = useInput("", "");
  const categorySelect = useSelect(CATEGORIES[0]);
  const prosConsRadio = useRadio("true", "prosCons");
  const contentsInput = useInput("", "");

  const debateInfo: IDebateInfo = {
    title: titleInput.value,
    author: "tempAuthor", //!
    author_pros: prosConsRadio.value,
    category: categorySelect.value,
    contents: contentsInput.value,
  };

  const create = () => {
    const title = titleInput.value.trim().replace(/ +/g, " ");
    titleInput.setValue(title);
    const content = contentsInput.value.trim().replace(/ +/g, " ");
    contentsInput.setValue(content);

    if (/[^\s\w가-힣.,!?%&()]/.test(title)) {
      setValidateNotice(
        "제목은 한글, 영어, 숫자 및 특수문자【.,!?%&()_】만 포함 가능합니다.",
      );
      titleRef.current?.focus();
      return;
    }
    if (title.length < 5 || title.length > 80) {
      setValidateNotice("제목은 5자 이상, 80자 이하여야 합니다.");
      titleRef.current?.focus();
      return;
    }
    setValidateNotice("");

    axios
      .post(`${process.env.NEXT_PUBLIC_API_URL}/debates`, debateInfo, {
        withCredentials: true,
      })
      .then((res) => {
        router.push(`/debates/debate/${res.data.id}`);
      })
      .catch(() => {
        setIsErrModalOn(true);
      });
  };

  return (
    <div>
      {isErrModalOn ? (
        <ConfirmModal
          title="작성 실패"
          content="에러가 발생해 작성에 실패했습니다."
          firstBtn="확인"
          firstFunc={() => {
            setIsErrModalOn(false);
          }}
        />
      ) : null}
      {isCancelModalOn ? (
        <ConfirmModal
          title="작성 취소"
          content="작성을 취소하고 나가겠습니까?"
          firstBtn="머무르기"
          firstFunc={() => {
            setIsCancelModalOn(false);
          }}
          secondBtn="나가기"
          secondFunc={() => {
            router.push("/debates");
          }}
        />
      ) : null}
      <h1>Create</h1>
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
      <button onClick={create}>만들기</button>
    </div>
  );
}
