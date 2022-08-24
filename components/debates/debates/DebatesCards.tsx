import { useEffect, useState } from "react";
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
  TDebateOfDebates,
  IUseInputResult,
  IUseSelectResult,
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
  search: IUseInputResult;
  orderSelect: IUseSelectResult;
  isSearchListOn: boolean;
  setIsSearchListOn: (params: boolean) => void;
}) {
  const router = useRouter();
  const { ref, inView } = useInView();
  const [isModalOn, setIsModalOn] = useState<boolean>(false);
  const [listOfDebate, setListOfDebates] = useState<TDebateOfDebates[]>([]);

  const user = useGetUser();

  useEffect(() => {
    if (inView && debates.hasNextPage) debates.fetchNextPage();
  }, [debates, inView]);

  useEffect(() => {
    setListOfDebates(() => {
      return debates.data
        ? debates.data?.pages
            .map((page) =>
              page.list.filter((debate: TDebateOfDebates) => {
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
                );
              }),
            )
            .flat()
        : [];
    });
  }, [categories, debates.data, statuses]);

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
        <div className={styles.cards}>
          {listOfDebate.map((debate) => {
            const status = debate.video_url
              ? STATUSES[2]
              : debate.participant?.id
              ? STATUSES[1]
              : STATUSES[0];
            return (
              <div key={debate.id}>
                <DebateCard debateId={debate.id} status={status} />
              </div>
            );
          })}
          {listOfDebate.length === 0 ? (
            <div className={styles.empty_message}>
              해당하는 토론이 없습니다.
            </div>
          ) : null}
        </div>
        <div ref={ref}></div>
      </div>
    </>
  );
}
