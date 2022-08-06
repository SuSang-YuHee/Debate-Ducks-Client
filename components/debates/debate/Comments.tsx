import Image from "next/image";
import { toast } from "react-hot-toast";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import { DMYorHM } from "../../../utils/common/formatStrDate";
import {
  useDeleteComment,
  useGetComments,
  usePatchComment,
  usePostComment,
} from "../../../utils/queries/comments";
import { useGetUser } from "../../../utils/queries/users";
import { useInput, useSelect } from "../../../utils/common/useInputSelect";
import { removeSpace } from "../../../utils/common/removeSpace";
import { COMMENT_ORDER, OPINIONS } from "../../../utils/common/constant";
import styles from "./Comments.module.scss";

import CheckSignInModal from "../../common/modal/CheckSignInModal";
import ConfirmModal from "../../common/modal/ConfirmModal";

import { CommentOfDebate } from "../../../types";

export default function Comments({ debateId }: { debateId: number }) {
  const { ref, inView } = useInView();
  const [isCheckModalOn, setIsCheckModalOn] = useState<boolean>(false);
  const [isEditOn, setIsEditOn] = useState<boolean>(false);
  const [isDeleteModalOn, setIsDeleteModalOn] = useState<boolean>(false);
  const [commentId, setCommentId] = useState<number>(0);

  const commentCreateInput = useInput("", "");
  const commentCreateSelect = useSelect(OPINIONS[1][1], refetch);
  const commentEditInput = useInput("", "");
  const commentEditSelect = useSelect(OPINIONS[1][1], refetch);
  const orderSelect = useSelect(COMMENT_ORDER[0][1], refetch);

  const user = useGetUser();
  const comments = useGetComments(debateId, orderSelect.value);
  const postComment = usePostComment(debateId);
  const patchComment = usePatchComment(debateId);
  const deleteComment = useDeleteComment(debateId);

  useEffect(() => {
    if (inView && comments.hasNextPage) comments.fetchNextPage();
  }, [comments, inView]);

  function refetch() {
    setTimeout(() => comments.refetch(), 1);
  }

  const handleCreate = () => {
    const comment = removeSpace(commentCreateInput.value);
    console.log(comment);
    if (!user.data) {
      setIsCheckModalOn(true);
    } else if (comment.length < 1 || comment.length > 500) {
      toast.error(
        `댓글은 1자 이상, 500자 이하여야 합니다.\n(현재 ${comment.length}자)`,
      );
    } else {
      postComment.mutate(
        {
          contents: comment,
          pros:
            commentCreateSelect.value === "true"
              ? true
              : commentCreateSelect.value === "false"
              ? false
              : null,
          target_debate_id: debateId,
          target_user_id: user.data?.id || "",
        },
        {
          onSuccess: () => {
            commentCreateInput.setValue("");
            commentCreateSelect.setValue("");
          },
        },
      );
    }
  };

  const handleEdit = (commentId: number, contents: string) => {
    const comment = removeSpace(commentEditInput.value);
    if (comment === removeSpace(contents)) {
      toast.error("변경된 내용이 없습니다.");
    } else if (comment.length < 1 || comment.length > 500) {
      toast.error(
        `댓글은 1자 이상, 500자 이하여야 합니다.\n(현재 ${comment.length}자)`,
      );
    } else {
      patchComment.mutate({
        id: commentId,
        pros:
          commentEditSelect.value === "true"
            ? true
            : commentEditSelect.value === "false"
            ? false
            : null,
        contents: comment,
      });
      setIsEditOn(false);
    }
  };

  return (
    <>
      <CheckSignInModal
        isModalOn={isCheckModalOn}
        setIsModalOn={setIsCheckModalOn}
      />
      {isDeleteModalOn ? (
        <ConfirmModal
          title={"댓글 삭제"}
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
      <div className={styles.create_box}>
        <select
          className={`${styles.select} ${
            commentCreateSelect.value === "true"
              ? styles.select_pros
              : commentCreateSelect.value === "false"
              ? styles.select_cons
              : ""
          }`}
          {...commentCreateSelect.attribute}
        >
          {OPINIONS.map((opinion) => (
            <option key={opinion[1]} value={opinion[1]}>
              {opinion[0]}
            </option>
          ))}
        </select>
        <textarea
          className={styles.textarea}
          {...commentCreateInput.attribute}
        />
        <div className={styles.btn} onClick={handleCreate}>
          생성
        </div>
      </div>
      {comments.data?.pages[0].list.length !== 0 ? (
        <>
          <div className={styles.order_box}>
            <select className={styles.select} {...orderSelect.attribute}>
              {COMMENT_ORDER.map((order) => (
                <option key={order[1]} value={order[1]}>
                  {order[0]}
                </option>
              ))}
            </select>
          </div>
          <div className={styles.comments_box}>
            <div className={styles.comment_box}>
              {comments.data?.pages.map((page, idx) => (
                <div key={idx}>
                  {page.list.map((comment: CommentOfDebate) => (
                    <div
                      className={`${styles.comment} ${
                        comment.pros
                          ? styles.comment_pros
                          : comment.pros !== null
                          ? styles.comment_cons
                          : ""
                      }`}
                      key={comment.id}
                    >
                      <div className={styles.info_box}>
                        <div className={styles.imageAndName_box}>
                          <div className={styles.image_box}>
                            <Image
                              className={styles.image}
                              src={
                                comment.target_user.profile_image
                                  ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${comment.target_user.profile_image}`
                                  : "/images/profiles/default-gray.png"
                              }
                              alt={
                                comment.target_user?.nickname || "기본 이미지"
                              }
                              width="50"
                              height="50"
                              objectFit="cover"
                              objectPosition="center"
                              unoptimized={true}
                            />
                          </div>
                          <div className={styles.name}>
                            {comment.target_user.nickname || "탈퇴한 회원"}
                          </div>
                        </div>
                        <div className={styles.date}>
                          {comment.updated_date
                            ? `${DMYorHM(comment.updated_date)} (수정됨)`
                            : DMYorHM(comment.created_date)}
                        </div>
                      </div>
                      {isEditOn && commentId === comment.id ? (
                        <div className={styles.contents_box}>
                          <select
                            className={styles.select}
                            {...commentEditSelect.attribute}
                          >
                            {OPINIONS.map((opinion) => (
                              <option key={opinion[1]} value={opinion[1]}>
                                {opinion[0]}
                              </option>
                            ))}
                          </select>
                          <textarea
                            className={styles.input}
                            {...commentEditInput.attribute}
                          />
                          <div className={styles.btn_box}>
                            <button
                              className={`${styles.btn} ${styles.btn_cons}`}
                              onClick={() => setIsEditOn(false)}
                            >
                              취소
                            </button>
                            <button
                              className={`${styles.btn} ${styles.btn_pros}`}
                              onClick={() =>
                                handleEdit(comment.id, comment.contents)
                              }
                            >
                              수정
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className={styles.contents_box}>
                          <pre className={styles.contents}>
                            {comment.contents}
                          </pre>
                          <div className={styles.btn_box}>
                            {user.data &&
                            user.data.id === comment.target_user.id ? (
                              <>
                                <div
                                  className={`${styles.btn} ${styles.btn_pros}`}
                                  onClick={() => {
                                    setCommentId(comment.id);
                                    commentEditInput.setValue(comment.contents);
                                    commentEditSelect.setValue(
                                      `${comment.pros}`,
                                    );
                                    setIsEditOn(true);
                                  }}
                                >
                                  편집
                                </div>
                                <div
                                  className={`${styles.btn} ${styles.btn_cons}`}
                                  onClick={() => {
                                    setCommentId(comment.id);
                                    setIsDeleteModalOn(true);
                                  }}
                                >
                                  삭제
                                </div>
                              </>
                            ) : null}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ))}
            </div>
            <div ref={ref}></div>
          </div>
        </>
      ) : (
        <div className={styles.empty_message}>아직 댓글이 없습니다.</div>
      )}
    </>
  );
}
