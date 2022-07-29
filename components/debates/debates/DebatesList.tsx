import { Dispatch, SetStateAction } from "react";

import { useGetDebates } from "../../../utils/queries/debates";
import { useInput, useSelect } from "../../../utils/common/useInputSelect";

import DebatesContainer from "./DebatesContainer";

export default function DebatesList({
  list,
  order,
  setOrder,
}: {
  list: string[];
  order: string;
  setOrder: Dispatch<SetStateAction<string>>;
}) {
  const search = useInput("", "");
  const orderSelect = useSelect(order, refetch, setOrder);

  const debates = useGetDebates(search.value, orderSelect.value);

  function refetch() {
    setTimeout(() => debates.refetch(), 1);
  }

  return (
    <DebatesContainer
      list={list}
      isDisabledSearch={false}
      debates={debates}
      refetch={refetch}
      search={search}
      orderSelect={orderSelect}
    />
  );
}
