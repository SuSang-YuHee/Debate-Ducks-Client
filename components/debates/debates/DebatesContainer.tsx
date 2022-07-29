import { useEffect, useState } from "react";
import { UseInfiniteQueryResult } from "react-query";
import { useRouter } from "next/router";
import { useInView } from "react-intersection-observer";

import { checkCategory } from "../../../utils/debates/checkCategory";
// import { useGetUser } from "../../../utils/queries/users";

import {
  DebateOfDebates,
  UseInputResult,
  UseSelectResult,
} from "../../../types";
import { COMMENT_ORDER } from "../../../utils/common/constant";

export default function DebatesContainer({
  list,
  isDisabledSearch,
  debates,
  refetch,
  search,
  orderSelect,
}: {
  list: string[];
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
}) {
  const router = useRouter();
  const { ref, inView } = useInView();
  const [isSearchListOn, setIsSearchListOn] = useState<boolean>(false);

  // const user = useGetUser();

  const checkEmpty = () => {
    return (
      debates.data?.pages
        .map((page) =>
          page.list.filter((debate: DebateOfDebates) =>
            checkCategory(list, debate.category),
          ),
        )
        .flat().length === 0
    );
  };

  useEffect(() => {
    if (inView && debates.hasNextPage) debates.fetchNextPage();
  }, [debates, inView]);

  return (
    <div>
      <div>
        <button onClick={() => router.push("/debates/create")}>
          토론 만들기
        </button>
        {isSearchListOn ? (
          <div>
            <input {...search.attribute} disabled />
            <button
              onClick={() => {
                search.setValue("");
                refetch();
                setIsSearchListOn(false);
              }}
            >
              X
            </button>
          </div>
        ) : (
          <div>
            <input {...search.attribute} disabled={isDisabledSearch} />
            <button
              onClick={() => {
                refetch();
                setIsSearchListOn(true);
              }}
              disabled={!search.value || isDisabledSearch}
            >
              검색
            </button>
          </div>
        )}
      </div>
      <select {...orderSelect.attribute}>
        {COMMENT_ORDER.map((order) => (
          <option key={order[0]} value={order[1]}>
            {order[0]}
          </option>
        ))}
      </select>
      {debates.data?.pages.map((page, idx) => (
        <div key={idx}>
          {page.list.map((debate: DebateOfDebates) =>
            checkCategory(list, debate.category) ? (
              <div key={debate.id}>
                <div>{debate.title}</div>
              </div>
            ) : null,
          )}
        </div>
      ))}
      <div>{checkEmpty() ? "토론이 없습니다." : null}</div>
      <div ref={ref}></div>
    </div>
  );
}
