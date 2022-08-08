import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { UseInfiniteQueryResult } from "react-query";
import { useRouter } from "next/router";
import { useInView } from "react-intersection-observer";

import { checkFilters } from "../../../utils/debates/checkFilters";
import { useGetUser } from "../../../utils/queries/users";
import { COMMENT_ORDER, STATUSES } from "../../../utils/common/constant";
import styles from "./DebatesCards.module.scss";

import CheckSignInModal from "../../common/modal/CheckSignInModal";
import DebateCard from "./DebateCard";

import {
  DebateOfDebates,
  UseInputResult,
  UseSelectResult,
} from "../../../types";

export default function DebatesCards({
  statuses,
  categories,
  isDisabledSearch,
  debates,
  refetch,
  search,
  orderSelect,
  isSearchListOn,
  setIsSearchListOn,
}: {
  statuses: string[];
  categories: string[];
  isDisabledSearch: boolean;
  debates: UseInfiniteQueryResult<
    {
      list: [];
      isLast: boolean;
      nextPage: string;
    },
    unknown
  >;
  refetch: () => void;
  search: UseInputResult;
  orderSelect: UseSelectResult;
  isSearchListOn: boolean;
  setIsSearchListOn: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();
  const { ref, inView } = useInView();
  const [isModalOn, setIsModalOn] = useState<boolean>(false);

  const user = useGetUser();

  useEffect(() => {
    if (inView && debates.hasNextPage) debates.fetchNextPage();
  }, [debates, inView]);

  const checkEmpty = () => {
    return (
      debates.data?.pages
        .map((page) =>
          page.list.filter((debate: DebateOfDebates) => {
            const status = debate.video_url
              ? STATUSES[2]
              : debate.participant?.id
              ? STATUSES[1]
              : STATUSES[0];
            return checkFilters(statuses, status, categories, debate.category);
          }),
        )
        .flat().length === 0
    );
  };

  return (
    <>
      <CheckSignInModal isModalOn={isModalOn} setIsModalOn={setIsModalOn} />
      <div className={styles.outer}>
        <div
          className={styles.btn_edit}
          onClick={() => {
            if (user.data) {
              router.push("/create");
            } else {
              setIsModalOn(true);
            }
          }}
        >
          토론 만들기
        </div>
        <div className={styles.container}>
          <select className={styles.select} {...orderSelect.attribute}>
            {COMMENT_ORDER.map((order) => (
              <option key={order[0]} value={order[1]}>
                {order[0]}
              </option>
            ))}
          </select>
          {isSearchListOn ? (
            <div className={styles.item}>
              <input
                className={`${styles.input} ${
                  !isDisabledSearch ? "" : styles.input_disabled
                }`}
                {...search.attribute}
                disabled
              />
              <div
                className={`${styles.btn_search} ${
                  !isDisabledSearch ? "" : styles.btn_search_disabled
                }`}
                onClick={() => {
                  if (!isDisabledSearch) {
                    search.setValue("");
                    refetch();
                    setIsSearchListOn(false);
                  }
                }}
              >
                ☓
              </div>
            </div>
          ) : (
            <div className={styles.item}>
              <input
                className={`${styles.input} ${
                  !isDisabledSearch ? "" : styles.input_disabled
                }`}
                {...search.attribute}
                disabled={isDisabledSearch}
              />
              <div
                className={`${styles.btn_search} ${
                  search.value && !isDisabledSearch
                    ? ""
                    : styles.btn_search_disabled
                }`}
                onClick={() => {
                  if (search.value && !isDisabledSearch) {
                    refetch();
                    setIsSearchListOn(true);
                  }
                }}
              >
                ⚲
              </div>
            </div>
          )}
        </div>
        {debates.data?.pages.map((page, idx) => (
          <div className={styles.cards} key={idx}>
            {page.list.map((debate: DebateOfDebates) => {
              const status = debate.video_url
                ? STATUSES[2]
                : debate.participant?.id
                ? STATUSES[1]
                : STATUSES[0];
              return checkFilters(
                statuses,
                status,
                categories,
                debate.category,
              ) ? (
                <div key={debate.id}>
                  <DebateCard debateId={debate.id} status={status} />
                </div>
              ) : null;
            })}
          </div>
        ))}
        <div className={styles.empty_message}>
          {checkEmpty() ? "해당하는 토론이 없습니다." : null}
        </div>
        <div ref={ref}></div>
      </div>
    </>
  );
}
