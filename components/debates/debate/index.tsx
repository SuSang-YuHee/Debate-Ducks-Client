import { useState } from "react";

import { useGetDebate } from "../../../utils/queries/debates";
import {
  useDeleteHeart,
  useGetHeart,
  usePostHeart,
} from "../../../utils/queries/hearts";

import AfterDebate from "./AfterDebate";
import DebaterInfo from "./DebaterInfo";
import EditAndDelete from "./EditAndDelete";
import ConfirmModal from "../../common/modal/ConfirmModal";

export default function Debate({ debateId }: { debateId: number }) {
  const userId = "01G85SA6V8NXD7XGB155SC4S17"; //!

  const [isHeartErrModalOn, setIsHeartErrModalOn] = useState<boolean>(false);

  const debate = useGetDebate(debateId);
  const heart = useGetHeart({
    target_debate_id: debateId,
    target_user_id: userId,
  });
  const postHeart = usePostHeart(setIsHeartErrModalOn);
  const deleteHeart = useDeleteHeart(setIsHeartErrModalOn);

  return (
    <div>
      {isHeartErrModalOn ? (
        <ConfirmModal
          title="반영 실패"
          content="좋아요 반영에 실패했습니다. 다시 한번 확인해 주세요."
          firstBtn="확인"
          firstFunc={() => {
            setIsHeartErrModalOn(false);
          }}
        />
      ) : null}
      <h1>{debate.data?.title}</h1>
      <p>{debate.data?.created_date}</p>
      <p>{debate.data?.created_date}</p>
      <p>{debate.data?.category}</p>
      <p
        onClick={() => {
          if (heart.data) {
            deleteHeart.mutate({
              target_debate_id: debateId,
              target_user_id: userId,
            });
          } else {
            postHeart.mutate({
              target_debate_id: debateId,
              target_user_id: userId,
            });
          }
        }}
      >
        {heart.data ? "true" : "false"}
      </p>
      <p>{debate.data?.heartCnt}</p>
      <EditAndDelete debateId={debateId} />
      <DebaterInfo debateId={debateId} />
      <pre>{debate.data?.contents}</pre>
      <AfterDebate debateId={debateId} />
    </div>
  );
}
