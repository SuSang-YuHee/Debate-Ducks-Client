import { useRouter } from "next/router";
import { useRef, useState } from "react";

import { CATEGORIES } from "../../utils/constant";
import { useInput, useRadio, useSelect } from "../../utils/useInputSelect";
import { usePostDebate } from "../../utils/queries/debates";
import { createOrEdit } from "../../utils/debates/createOrEdit";

import CreateOrEdit from "../../components/debates/CreateOrEdit";

export default function Create() {
  const router = useRouter();
  const [isCancelModalOn, setIsCancelModalOn] = useState<boolean>(false);
  const titleRef = useRef<HTMLInputElement>(null);

  const postDebate = usePostDebate();

  const titleInput = useInput("", "");
  const categorySelect = useSelect(CATEGORIES[0]);
  const prosConsRadio = useRadio("true", "prosCons");
  const contentsInput = useInput("", "");

  const create = () => {
    createOrEdit(titleRef, titleInput, () => {
      postDebate.mutate({
        title: titleInput.value,
        author_pros: prosConsRadio.value,
        category: categorySelect.value,
        contents: contentsInput.value,
        author_id: "01G85SA6V8NXD7XGB155SC4S17",
      });
    });
  };

  return (
    <div>
      <CreateOrEdit
        isCancelModalOn={isCancelModalOn}
        setIsCancelModalOn={setIsCancelModalOn}
        titleRef={titleRef}
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
