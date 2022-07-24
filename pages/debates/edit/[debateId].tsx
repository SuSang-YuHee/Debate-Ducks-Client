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

  const [isSameModal, setIsSameModal] = useState<boolean>(false);
  const [isErrorModalOn, setIsErrorModalOn] = useState<boolean>(false);
  const [isCancelModalOn, setIsCancelModalOn] = useState<boolean>(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const [validateNotice, setValidateNotice] = useState<string>("");

  const debate = useGetDebate(debateId);
  const postDebate = usePatchDebate(debateId, setIsErrorModalOn);

  const titleInput = useInput(debate.data?.title || "", "");
  const categorySelect = useSelect(debate.data?.category || CATEGORIES[0]);
  const prosConsRadio = useRadio(
    debate.data?.author_pros ? `${debate.data?.author_pros}` : "false",
    "prosCons",
  );
  const contentsInput = useInput(debate.data?.contents || "", "");

  const debatePatch: DebatePatch = {
    title: titleInput.value,
    author_pros: prosConsRadio.value,
    category: categorySelect.value,
    contents: contentsInput.value,
    id: debate.data?.id || 0,
  };

  const edit = () => {
    if (
      debate.data?.title === debatePatch.title &&
      debate.data?.author_pros === debatePatch.author_pros &&
      debate.data?.category === debatePatch.category &&
      debate.data?.contents === debatePatch.contents
    ) {
      setIsSameModal(true);
    } else {
      createOrEdit(titleRef, setValidateNotice, titleInput, () => {
        postDebate.mutate(debatePatch);
      });
    }
  };

  if (!debate.data) return <>404</>;
  return (
    <div>
      {isSameModal ? (
        <ConfirmModal
          title="수정 실패"
          content="변경된 내용이 없습니다."
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
        createOrEditStr="수정"
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
  await queryClient.prefetchQuery(["debates", `${debateId}`], () =>
    getDebate(debateId),
  );
  return {
    props: {
      dehydratedState: dehydrate(queryClient),
    },
  };
};
