import { useState } from "react";

import { useGetDebate } from "../../../utils/queries/debates";
import {
  useDeleteHeart,
  useGetHeart,
  usePostHeart,
} from "../../../utils/queries/heart";

import AfterDebate from "./AfterDebate";
import DebaterInfo from "./DebaterInfo";
import EditAndDelete from "./EditAndDelete";
import ConfirmModal from "../../common/modal/ConfirmModal";

export default function Debate({ debateId }: { debateId: number }) {
  const [isHeartErrorModalOn, setHeartIsErrorModalOn] =
    useState<boolean>(false);

  const debate = useGetDebate(debateId);
  const heart = useGetHeart(debateId, "01G85SA6V8NXD7XGB155SC4S17");
  const postHeart = usePostHeart(setHeartIsErrorModalOn);
  const deleteHeart = useDeleteHeart(setHeartIsErrorModalOn);

  return (
    <div>
      {isHeartErrorModalOn ? (
        <ConfirmModal
          title="반영 실패"
          content="좋아요 반영에 실패했습니다. 다시 한번 확인해 주세요."
          firstBtn="확인"
          firstFunc={() => {
            setHeartIsErrorModalOn(false);
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
              debateId,
              userId: "01G85SA6V8NXD7XGB155SC4S17",
            });
          } else {
            postHeart.mutate({
              debateId,
              userId: "01G85SA6V8NXD7XGB155SC4S17",
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
