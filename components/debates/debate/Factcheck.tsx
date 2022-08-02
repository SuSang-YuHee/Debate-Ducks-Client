import toast from "react-hot-toast";
import { useState } from "react";

import { useInput } from "../../../utils/common/useInputSelect";
import { useGetUser } from "../../../utils/queries/users";
import { useGetDebate } from "../../../utils/queries/debates";
import {
  useDeleteFactcheck,
  usePatchFactcheck,
} from "../../../utils/queries/factchecks";
import { removeSpace } from "../../../utils/common/removeSpace";
import styles from "./Factchecks.module.scss";

import ConfirmModal from "../../common/modal/ConfirmModal";

export default function Factcheck({
  debateId,
  isPros,
}: {
  debateId: number;
  isPros: boolean;
}) {
  const [isEditOn, setIsEditOn] = useState<boolean>(false);
  const [isDeleteModalOn, setIsDeleteModalOn] = useState<boolean>(false);
  const [factcheckId, setFactcheckId] = useState<number>(0);

  const descriptionEdithInput = useInput("", "");
  const referenceEditInput = useInput("", "");

  const user = useGetUser();
  const debate = useGetDebate(debateId);
  const patchFactcheck = usePatchFactcheck(debateId);
  const deleteFactcheck = useDeleteFactcheck(debateId);

  const checkAuthor = () => {
    if (isPros === debate.data?.author_pros) {
      return user.data && debate.data?.author?.id === user.data?.id;
    } else {
      return user.data && debate.data?.participant?.id === user.data?.id;
    }
  };

  const handleEdit = () => {
    const description = removeSpace(descriptionEdithInput.value);
    const reference_url = removeSpace(referenceEditInput.value);

    if (reference_url.length > 0 && !/^http[s]?\:\/\//i.test(reference_url)) {
      toast.error("참조 주소는 url 형태여야 합니다.");
    } else if (description.length > 500) {
      toast.error("팩트체크 내용은 500자 이하여야 합니다.");
    } else {
      patchFactcheck.mutate({
        description,
        reference_url,
        id: factcheckId,
      });
      setIsEditOn(false);
    }
  };

  return (
    <>
      {isDeleteModalOn ? (
        <ConfirmModal
          title={"팩트체크 삭제"}
          content={"팩트체크를 삭제하시겠습니까?"}
          firstBtn={"취소하기"}
          firstFunc={() => {
            setIsDeleteModalOn(false);
          }}
          secondBtn={"삭제하기"}
          secondFunc={() => {
            deleteFactcheck.mutate(factcheckId);
            setIsDeleteModalOn(false);
          }}
        />
      ) : null}
      <div
        className={`${styles.factchecks_inner} ${
          isPros ? styles.factchecks_inner_pros : styles.factchecks_inner_cons
        }`}
      >
        <div className={styles.isPros}>
          {isPros
            ? `찬성 (${
                debate.data?.factchecks.filter((factcheck) => factcheck.pros)
                  .length
              }개)`
            : `반대 (${
                debate.data?.factchecks.filter((factcheck) => !factcheck.pros)
                  .length
              }개)`}
        </div>
        <div className={styles.factchecks_box}>
          {debate.data?.factchecks
            .filter((factcheck) => factcheck.pros === isPros)
            .map((factcheck) => (
              <div className={styles.factcheck} key={factcheck.id}>
                {isEditOn && factcheckId === factcheck.id ? (
                  <>
                    <textarea
                      className={`${styles.description} ${styles.input}`}
                      {...descriptionEdithInput.attribute}
                    />
                    <div className={styles.under_box}>
                      <input
                        className={`${styles.a} ${styles.input}`}
                        {...referenceEditInput.attribute}
                      />
                      <button
                        className={`${styles.btn} ${styles.btn_pros}`}
                        onClick={() => setIsEditOn(false)}
                      >
                        취소
                      </button>
                      <button
                        className={`${styles.btn} ${styles.btn_cons}`}
                        onClick={handleEdit}
                      >
                        수정
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <pre className={styles.description}>
                      {factcheck.description}
                    </pre>
                    <div className={styles.under_box}>
                      <div
                        className={`${isPros ? styles.pros : styles.cons} ${
                          styles.a
                        }`}
                      >
                        <a
                          href={factcheck.reference_url}
                          target="_blank"
                          rel="noreferrer"
                        >
                          {factcheck.reference_url}
                        </a>
                      </div>
                      {checkAuthor() ? (
                        <>
                          <div
                            className={`${styles.btn} ${styles.btn_pros}`}
                            onClick={() => {
                              setFactcheckId(factcheck.id);
                              descriptionEdithInput.setValue(
                                factcheck.description,
                              );
                              referenceEditInput.setValue(
                                factcheck.reference_url,
                              );
                              setIsEditOn(true);
                            }}
                          >
                            수정
                          </div>
                          <div
                            className={`${styles.btn} ${styles.btn_cons}`}
                            onClick={() => {
                              setFactcheckId(factcheck.id);
                              setIsDeleteModalOn(true);
                            }}
                          >
                            삭제
                          </div>
                        </>
                      ) : null}
                    </div>
                  </>
                )}
                <div className={styles.line}></div>
              </div>
            ))}
        </div>
      </div>
    </>
  );
}
