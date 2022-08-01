import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { dehydrate, QueryClient } from "react-query";
import { useState } from "react";
import toast from "react-hot-toast";

import { CATEGORIES } from "../../../utils/common/constant";
import { getDebate } from "../../../api/debates";
import {
  useInput,
  useRadio,
  useSelect,
} from "../../../utils/common/useInputSelect";
import { useGetUser } from "../../../utils/queries/users";
import { useGetDebate, usePatchDebate } from "../../../utils/queries/debates";

import CreateOrEdit from "../../../components/debates/CreateOrEdit";
import CheckSignInModal from "../../../components/common/modal/CheckSignInModal";

export default function Edit() {
  const router = useRouter();
  const param = router.query;
  const debateId =
    typeof param?.debateId === "string" ? parseInt(param?.debateId) : 0;
  const [isCheckModalOn, setIsCheckModalOn] = useState<boolean>(false);
  const [isCancelModalOn, setIsCancelModalOn] = useState<boolean>(false);

  const user = useGetUser();
  const debate = useGetDebate(debateId);
  const postDebate = usePatchDebate(debateId);

  const titleInput = useInput(debate.data?.title || "", "");
  const categorySelect = useSelect(debate.data?.category || CATEGORIES[0]);
  const prosConsRadio = useRadio(
    debate.data?.author_pros ? `${debate.data?.author_pros}` : "false",
    "prosCons",
  );
  const contentsInput = useInput(debate.data?.contents || "", "");

  const handleEdit = () => {
    if (!user.data) {
      setIsCheckModalOn(true);
    } else if (user.data?.id !== debate.data?.author?.id) {
      router.push(`/debates/${debate.data?.id}`);
      toast.error("해당 토론의 작성자만 토론을 수정할 수 있습니다.");
    } else if (debate.data?.video_url) {
      router.push(`/debates/${debate.data?.id}`);
      toast.error("이미 진행된 토론은 수정할 수 없습니다.");
    } else if (debate.data?.participant) {
      router.push(`/debates/${debate.data?.id}`);
      toast.error("참여자가 있어 토론을 수정할 수 없습니다.");
    } else if (
      debate.data?.title === titleInput.value &&
      debate.data?.author_pros === prosConsRadio.value &&
      debate.data?.category === categorySelect.value &&
      debate.data?.contents === contentsInput.value
    ) {
      toast.error("변경된 내용이 없습니다.");
    } else {
      postDebate.mutate({
        title: titleInput.value,
        author_pros: prosConsRadio.value,
        category: categorySelect.value,
        contents: contentsInput.value,
        id: debate.data?.id || 0,
      });
    }
  };

  if (!debate.data) return <>404</>;
  return (
    <div className="inner">
      <CheckSignInModal
        isModalOn={isCheckModalOn}
        setIsModalOn={setIsCheckModalOn}
      />
      <CreateOrEdit
        isCancelModalOn={isCancelModalOn}
        setIsCancelModalOn={setIsCancelModalOn}
        titleInput={titleInput}
        categorySelect={categorySelect}
        prosConsRadio={prosConsRadio}
        contentsInput={contentsInput}
        handler={handleEdit}
        createOrEdit="수정"
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
