import toast from "react-hot-toast";
import { useEffect, useState } from "react";

import { usePostFactcheck } from "../../../utils/queries/factchecks";
import { useInput } from "../../../utils/common/useInputSelect";
import { useGetUser } from "../../../utils/queries/users";
import { useGetDebate } from "../../../utils/queries/debates";
import { removeSpace } from "../../../utils/common/removeSpace";
import styles from "./Factchecks.module.scss";

import Factcheck from "./Factcheck";

export default function Factchecks({ debateId }: { debateId: number }) {
  const [isCreateOn, setIsCreateOn] = useState<boolean>(false);
  const [cnt, setCnt] = useState<number>(0);

  const descriptionCreateInput = useInput("", "");
  const referenceCreateInput = useInput("", "");

  const user = useGetUser();
  const debate = useGetDebate(debateId);
  const postFactcheck = usePostFactcheck(debateId);

  useEffect(() => {
    setCnt(removeSpace(descriptionCreateInput.value).length);
  }, [descriptionCreateInput.value]);

  const handleCreate = () => {
    const description = removeSpace(descriptionCreateInput.value);
    const reference_url = removeSpace(referenceCreateInput.value);

    if (reference_url.length > 0 && !/^http[s]?\:\/\//i.test(reference_url)) {
      toast.error("참조 주소는 url 형태여야 합니다.");
    } else if (description.length < 5 || description.length > 500) {
      toast.error("팩트체크 내용은 5자 이상, 500자 이하여야 합니다.");
    } else {
      let isPros;
      if (debate.data?.author_pros) {
        if (debate.data?.author?.id === user.data?.id) isPros = true;
        if (debate.data?.participant?.id === user.data?.id) isPros = false;
      } else {
        if (debate.data?.author?.id === user.data?.id) isPros = false;
        if (debate.data?.participant?.id === user.data?.id) isPros = true;
      }

      if (typeof isPros === "boolean") {
        postFactcheck.mutate({
          target_debate_id: debateId,
          target_user_id: user.data?.id || "",
          pros: isPros,
          description,
          reference_url,
        });
        referenceCreateInput.setValue("");
        descriptionCreateInput.setValue("");
      }
    }
  };

  return (
    <>
      <div className={styles.factchecks_outer}>
        <Factcheck debateId={debateId} isPros={true} />
        <Factcheck debateId={debateId} isPros={false} />
      </div>
      {isCreateOn ? (
        <div className={styles.create_factcheck}>
          <div className={styles.name}>팩트체크 내용</div>
          <textarea
            className={styles.create_input}
            {...descriptionCreateInput.attribute}
          />
          <div
            className={`${styles.cnt} ${
              cnt >= 5 && cnt <= 500 ? styles.cnt_active : ""
            }`}
          >
            {cnt} / 500
          </div>
          <div className={styles.name}>참조 주소</div>
          <input
            className={styles.create_input}
            {...referenceCreateInput.attribute}
          />
          <div className={styles.btn_box}>
            <button
              className={`${styles.btn_small} ${styles.btn_small_cons}`}
              onClick={() => setIsCreateOn(false)}
            >
              닫기
            </button>
            <button
              className={`${styles.btn_small} ${styles.btn_small_pros}`}
              onClick={handleCreate}
            >
              작성
            </button>
          </div>
        </div>
      ) : user.data &&
        (user.data.id === debate.data?.author?.id ||
          user.data.id === debate.data?.participant?.id) ? (
        <button className={styles.btn_big} onClick={() => setIsCreateOn(true)}>
          팩트체크 작성
        </button>
      ) : null}
    </>
  );
}
