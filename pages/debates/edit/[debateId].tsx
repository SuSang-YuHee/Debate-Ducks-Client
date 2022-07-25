import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { dehydrate, QueryClient } from "react-query";
import { useRef, useState } from "react";
import toast from "react-hot-toast";

import { CATEGORIES } from "../../../utils";
import { getDebate } from "../../../api/debates";
import { useInput, useRadio, useSelect } from "../../../utils/useInputSelect";
import { useGetDebate, usePatchDebate } from "../../../utils/queries/debates";
import { createOrEdit } from "../../../utils/debates/createOrEdit";

import CreateOrEdit from "../../../components/debates/CreateOrEdit";

export default function Edit() {
  const router = useRouter();
  const param = router.query;
  const debateId =
    typeof param?.debateId === "string" ? parseInt(param?.debateId) : 0;
  const [isCancelModalOn, setIsCancelModalOn] = useState<boolean>(false);
  const titleRef = useRef<HTMLInputElement>(null);

  const debate = useGetDebate(debateId);
  const postDebate = usePatchDebate(debateId);

  const titleInput = useInput(debate.data?.title || "", "");
  const categorySelect = useSelect(debate.data?.category || CATEGORIES[0]);
  const prosConsRadio = useRadio(
    debate.data?.author_pros ? `${debate.data?.author_pros}` : "false",
    "prosCons",
  );
  const contentsInput = useInput(debate.data?.contents || "", "");

  const edit = () => {
    if (
      debate.data?.title === titleInput.value &&
      debate.data?.author_pros === prosConsRadio.value &&
      debate.data?.category === categorySelect.value &&
      debate.data?.contents === contentsInput.value
    ) {
      toast.error("변경 내용이 없습니다.");
    } else {
      createOrEdit(titleRef, titleInput, () => {
        postDebate.mutate({
          title: titleInput.value,
          author_pros: prosConsRadio.value,
          category: categorySelect.value,
          contents: contentsInput.value,
          id: debate.data?.id || 0,
        });
      });
    }
  };

  if (!debate.data) return <>404</>;
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
