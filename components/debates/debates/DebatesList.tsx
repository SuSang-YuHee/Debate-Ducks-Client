import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

import { checkCategory } from "../../../utils/debates/checkCategory";
import { useGetDebates } from "../../../utils/queries/debates";
import { useSelect } from "../../../utils/common/useInputSelect";
import { COMMENT_ORDER } from "../../../utils/common/constant";

import { DebateOfDebates } from "../../../types";

export default function DebatesList({ list }: { list: string[] }) {
  const { ref, inView } = useInView();
  const orderSelect = useSelect(COMMENT_ORDER[0][1], refetch);

  const debates = useGetDebates(orderSelect.value);

  useEffect(() => {
    if (inView && debates.hasNextPage) debates.fetchNextPage();
  }, [debates, inView]);

  function refetch() {
    setTimeout(() => debates.refetch(), 1);
  }

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

  return (
    <div>
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
