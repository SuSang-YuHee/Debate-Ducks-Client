import { useState } from "react";

import { useGetDebate, usePatchDebate } from "../../../utils/queries/debates";

import ConfirmModal from "../../common/modal/ConfirmModal";

export default function DebaterInfo({ debateId }: { debateId: number }) {
  const debate = useGetDebate(debateId);

  const [isErrorModalOn, setIsErrorModalOn] = useState<boolean>(false);

  //!
  const user = {
    id: "01G85SA6V8NXD7XGB155SC4S18",
    nickname: "참여자",
    email: "test2@gmail.com",
    profile_image: null,
  };

  const participateDebate = usePatchDebate(debateId, setIsErrorModalOn, user);

  return (
    <div>
      <p>{debate.data?.author?.nickname}</p>
      {debate.data?.participant ? (
        <p>{debate.data?.participant?.nickname}</p>
      ) : (
        <div>
          {isErrorModalOn ? (
            <ConfirmModal
              title="참여 실패"
              content="참여에 실패했습니다. 다시 한번 확인해 주세요."
              firstBtn="확인"
              firstFunc={() => {
                setIsErrorModalOn(false);
              }}
            />
          ) : null}
          {debate.data?.author.id !== user.id ? (
            <button
              onClick={() => {
                participateDebate.mutate({
                  id: debate.data?.id || 0,
                  participant_id: user.id,
                });
              }}
            >
              참여
            </button>
          ) : null}
        </div>
      )}
    </div>
  );
}
