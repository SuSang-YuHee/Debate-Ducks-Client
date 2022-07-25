import { useGetDebate, usePatchDebate } from "../../../utils/queries/debates";

export default function DebaterInfo({ debateId }: { debateId: number }) {
  //!
  const user = {
    id: "01G85SA6V8NXD7XGB155SC4S18",
    nickname: "참여자",
    email: "test2@gmail.com",
    profile_image: null,
  };

  const debate = useGetDebate(debateId);
  const participateDebate = usePatchDebate(debateId, user);

  return (
    <div>
      <p>{debate.data?.author?.nickname}</p>
      {debate.data?.participant ? (
        <p>{debate.data?.participant?.nickname}</p>
      ) : (
        <div>
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
