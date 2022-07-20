import { useState } from "react";

import { useGetDebate, usePatchDebate } from "../../../utils/queries/debates";

import ConfirmModal from "../../common/modal/ConfirmModal";

export default function DebaterInfo({ debateId }: { debateId: number }) {
  const { data } = useGetDebate(debateId);

  const [isErrorModalOn, setIsErrorModalOn] = useState<boolean>(false);

  const participateDebate = usePatchDebate(setIsErrorModalOn);

  const debate = {
    id: data?.id || 0,
    participant_id: "01G85SA6V8NXD7XGB155SC4S18", //!
  };

  return (
    <div>
      <p>{data?.author?.name}</p>
      {data?.participant ? (
        <p>{data?.participant?.name}</p>
      ) : (
        <div>
          {isErrorModalOn ? (
            <ConfirmModal
              title="작성 실패"
              content="에러가 발생해 작성에 실패했습니다."
              firstBtn="확인"
              firstFunc={() => {
                setIsErrorModalOn(false);
              }}
            />
          ) : null}
          <button
            onClick={() => {
              participateDebate.mutate(debate);
            }}
          >
            참여
          </button>
        </div>
      )}
    </div>
  );
}
