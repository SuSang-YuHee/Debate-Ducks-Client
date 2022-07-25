import { useGetDebate } from "../../../utils/queries/debates";
import {
  useGetVote,
  usePatchVote,
  usePostVote,
} from "../../../utils/queries/votes";

export default function Vote({ debateId }: { debateId: number }) {
  const userId = "01G85SA6V8NXD7XGB155SC4S17";

  const debate = useGetDebate(debateId);
  const vote = useGetVote({
    target_debate_id: debateId,
    target_user_id: userId,
  });
  const postVote = usePostVote();
  const patchVote = usePatchVote();

  const doVote = (isPros: boolean) => {
    if (vote.data?.isVote) {
      patchVote.mutate({
        target_debate_id: debateId,
        target_user_id: userId,
        pros: isPros,
      });
    } else {
      postVote.mutate({
        target_debate_id: debateId,
        target_user_id: userId,
        pros: isPros,
      });
    }
  };

  return (
    <div>
      {vote.data?.isVote && vote.data?.pros ? (
        <button>X</button>
      ) : (
        <button onClick={() => doVote(true)}>찬성</button>
      )}
      {vote.data?.isVote && !vote.data?.pros ? (
        <button>X</button>
      ) : (
        <button onClick={() => doVote(false)}>반대</button>
      )}
      <p>찬성표: {debate.data?.vote.prosCnt}</p>
      <p>반대표: {debate.data?.vote.consCnt}</p>
    </div>
  );
}
