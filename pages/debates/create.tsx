import { useRouter } from "next/router";
import { useRef, useState } from "react";

import { CATEGORIES } from "../../utils";
import { useInput, useRadio, useSelect } from "../../utils/useInputSelect";
import { usePostDebate } from "../../utils/queries/debates";
import { createOrEdit } from "../../utils/debates/createOrEdit";

import CreateOrEdit from "../../components/debates/CreateOrEdit";

import { DebatePost } from "../../types";

export default function Create() {
  const router = useRouter();

  const [isErrorModalOn, setIsErrorModalOn] = useState<boolean>(false);
  const [isCancelModalOn, setIsCancelModalOn] = useState<boolean>(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const [validateNotice, setValidateNotice] = useState<string>("");

  const postDebate = usePostDebate(setIsErrorModalOn);

  const titleInput = useInput("", "");
  const categorySelect = useSelect(CATEGORIES[0]);
  const prosConsRadio = useRadio("true", "prosCons");
  const contentsInput = useInput("", "");

  const debatePost: DebatePost = {
    title: titleInput.value,
    author_pros: prosConsRadio.value,
    category: categorySelect.value,
    contents: contentsInput.value,
    author_id: "01G85SA6V8NXD7XGB155SC4S17",
  };

  const create = () => {
    createOrEdit(titleRef, setValidateNotice, titleInput, () => {
      postDebate.mutate(debatePost);
    });
  };

  return (
    <div>
      <CreateOrEdit
        isErrorModalOn={isErrorModalOn}
        setIsErrorModalOn={setIsErrorModalOn}
        isCancelModalOn={isCancelModalOn}
        setIsCancelModalOn={setIsCancelModalOn}
        titleRef={titleRef}
        validateNotice={validateNotice}
        setValidateNotice={setValidateNotice}
        titleInput={titleInput}
        categorySelect={categorySelect}
        prosConsRadio={prosConsRadio}
        contentsInput={contentsInput}
        createOrEdit={create}
        createOrEditStr="작성"
        routerPush={() => {
          router.push("/debates");
        }}
      />
    </div>
  );
}
