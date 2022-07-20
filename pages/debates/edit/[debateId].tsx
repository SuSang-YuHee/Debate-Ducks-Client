import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { dehydrate, QueryClient } from "react-query";
import { useRef, useState } from "react";

import { CATEGORIES } from "../../../utils";
import { getDebate } from "../../../api/debates";
import { useInput, useRadio, useSelect } from "../../../utils/useInputSelect";
import { useGetDebate, usePatchDebate } from "../../../utils/queries/debates";
import { createOrEdit } from "../../../utils/debates/createOrEdit";

import ConfirmModal from "../../../components/common/modal/ConfirmModal";
import CreateOrEdit from "../../../components/debates/CreateOrEdit";

import { DebatePatch } from "../../../types";

export default function Edit() {
  const router = useRouter();
  const param = router.query;
  const debateId =
    typeof param?.debateId === "string" ? parseInt(param?.debateId) : 0;
  const { data } = useGetDebate(debateId);

  const [isSameModal, setIsSameModal] = useState<boolean>(false);
  const [isErrorModalOn, setIsErrorModalOn] = useState<boolean>(false);
  const [isCancelModalOn, setIsCancelModalOn] = useState<boolean>(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const [validateNotice, setValidateNotice] = useState<string>("");

  const titleInput = useInput(data?.title || "", "");
  const categorySelect = useSelect(data?.category || CATEGORIES[0]);
  const prosConsRadio = useRadio(
    data?.author_pros ? `${data?.author_pros}` : "false",
    "prosCons",
  );
  const contentsInput = useInput(data?.contents || "", "");

  const postDebate = usePatchDebate(setIsErrorModalOn, true);

  const debate: DebatePatch = {
    title: titleInput.value,
    author_pros: prosConsRadio.value,
    category: categorySelect.value,
    contents: contentsInput.value,
    id: data?.id || 0,
  };

  const edit = () => {
    if (!data) return;
    if (
      data.title === debate.title &&
      data.author_pros === debate.author_pros &&
      data.category === debate.category &&
      data.contents === debate.contents
    ) {
      setIsSameModal(true);
    } else {
      createOrEdit(titleRef, setValidateNotice, titleInput, () => {
        postDebate.mutate(debate);
      });
    }
  };

  if (!data) return <>404</>;
  return (
    <div>
      {isSameModal ? (
        <ConfirmModal
          title="작성 실패"
          content="변경 내용이 없습니다."
          firstBtn="확인"
          firstFunc={() => {
            setIsSameModal(false);
          }}
        />
      ) : null}
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
        createOrEdit={edit}
        routerPush={() => {
          router.push(`/debates/${debateId}`);
        }}
      />
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const debateId =
    typeof context.params?.debateId === "string"
      ? parseInt(context.params?.debateId)
      : 0;
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery(["debate", `${debateId}`], () =>
    getDebate(debateId),
  );
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
