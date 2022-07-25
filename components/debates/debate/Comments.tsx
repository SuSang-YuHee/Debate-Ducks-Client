import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import { DMYorHM } from "../../../utils/formatStrDate";
import {
  useDeleteComment,
  useGetComments,
  usePatchComment,
  usePostComment,
} from "../../../utils/queries/comments";
import { useGetUser } from "../../../utils/queries/users";
import { useInput, useRadio } from "../../../utils/useInputSelect";
import { removeSpace } from "../../../utils/removeSpace";

import ConfirmModal from "../../common/modal/ConfirmModal";

import { CommentOfDebate } from "../../../types";

export default function Comments({ debateId }: { debateId: number }) {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("debate-ducks-token")
      : null;
  const { ref, inView } = useInView();
  const [isEditOn, setIsEditOn] = useState<boolean>(false);
  const [isDeleteModalOn, setIsDeleteModalOn] = useState<boolean>(false);
  const [commentId, setCommentId] = useState<number>(0);

  const user = useGetUser(token || "");
  const comments = useGetComments(debateId);
  const postComment = usePostComment(debateId);
  const patchComment = usePatchComment(debateId);
  const deleteComment = useDeleteComment(debateId);

  const commentCreateInput = useInput("", "");
  const commentCreateRadio = useRadio("true", "create");
  const commentEditInput = useInput("", "");
  const commentEditRadio = useRadio("true", "edit");

  useEffect(() => {
    if (inView && comments.hasNextPage) comments.fetchNextPage();
  }, [comments, inView]);

  return (
    <div>
      {isDeleteModalOn ? (
        <ConfirmModal
          title={"삭제 확인"}
          content={"댓글을 삭제하시겠습니까?"}
          firstBtn={"취소하기"}
          firstFunc={() => {
            setIsDeleteModalOn(false);
          }}
          secondBtn={"삭제하기"}
          secondFunc={() => {
            deleteComment.mutate(commentId);
            setIsDeleteModalOn(false);
          }}
        />
      ) : null}
      {"입력: "}
      <textarea {...commentCreateInput.attribute} />
      {"찬반: "}
      <input {...commentCreateRadio.attributeTrue} />
      <input {...commentCreateRadio.attributeFalse} />
      <button
        onClick={() => {
          if (
            removeSpace(commentCreateInput.value).length >= 1 &&
            removeSpace(commentCreateInput.value).length <= 500
          ) {
            postComment.mutate(
              {
                contents: removeSpace(commentCreateInput.value),
                pros: commentCreateRadio.value,
                target_debate_id: debateId,
                target_user_id: user.data?.id || "",
              },
              {
                onSuccess: () => {
                  commentCreateInput.setValue("");
                  commentCreateRadio.setValue("true");
                },
              },
            );
          } else {
            toast.error("댓글은 1자 이상, 500자 이하여야 합니다.");
          }
        }}
      >
        생성
      </button>
      {comments.data?.pages.map((page, idx) => (
        <div key={idx}>
          {page.list.map((comment: CommentOfDebate) => (
            <div
              key={comment.id}
              className={comment.pros ? "prosComment" : "consComment"}
            >
              <p>{comment.target_user.nickname}</p>
              <p>
                {comment.updated_date
                  ? `수정일 ${DMYorHM(comment.updated_date)}`
                  : `작성일 ${DMYorHM(comment.created_date)}`}
              </p>
              {isEditOn && commentId === comment.id ? (
                <div>
                  <textarea {...commentEditInput.attribute} />
                  <input {...commentEditRadio.attributeTrue} />
                  <input {...commentEditRadio.attributeFalse} />
                  <button onClick={() => setIsEditOn(false)}>취소</button>
                  <button
                    onClick={() => {
                      if (
                        removeSpace(commentEditInput.value).length >= 1 &&
                        removeSpace(commentEditInput.value).length <= 500
                      ) {
                        patchComment.mutate({
                          id: comment.id,
                          pros: commentEditRadio.value,
                          contents: removeSpace(commentEditInput.value),
                        });
                        setIsEditOn(false);
                      } else {
                        toast.error("댓글은 1자 이상, 500자 이하여야 합니다.");
                      }
                    }}
                  >
                    수정
                  </button>
                </div>
              ) : (
                <div>
                  <span>{comment.id}</span>
                  <pre>{comment.contents}</pre>
                  <span>{`${comment.pros}`}</span>
                </div>
              )}
              {user.data && user.data.id === comment.target_user.id ? (
                <div>
                  <button
                    onClick={() => {
                      setCommentId(comment.id);
                      commentEditInput.setValue(comment.contents);
                      commentEditRadio.setValue(`${comment.pros}`);
                      setIsEditOn(true);
                    }}
                  >
                    편집
                  </button>
                  <button
                    onClick={() => {
                      setCommentId(comment.id);
                      setIsDeleteModalOn(true);
                    }}
                  >
                    삭제
                  </button>
                </div>
              ) : null}
              <p>----</p>
            </div>
          ))}
        </div>
      ))}
      <div ref={ref}></div>
    </div>
  );
}
