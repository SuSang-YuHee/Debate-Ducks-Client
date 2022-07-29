import { Dispatch, SetStateAction } from "react";

import { useGetDebatesHeart } from "../../../utils/queries/debates";
import { useInput, useSelect } from "../../../utils/common/useInputSelect";
import { useGetUser } from "../../../utils/queries/users";
import DebatesContainer from "./DebatesContainer";

export default function DebatesHeartList({
  statuses,
  categories,
  order,
  setOrder,
}: {
  statuses: string[];
  categories: string[];
  order: string;
  setOrder: Dispatch<SetStateAction<string>>;
}) {
  const search = useInput("", "");
  const orderSelect = useSelect(order, refetch, setOrder);

  const user = useGetUser();
  const debates = useGetDebatesHeart(user.data?.id || "", orderSelect.value);

  function refetch() {
    setTimeout(() => debates.refetch(), 1);
  }

  return (
    <DebatesContainer
      statuses={statuses}
      categories={categories}
      isDisabledSearch={true}
      debates={debates}
      refetch={refetch}
      search={search}
      orderSelect={orderSelect}
    />
  );
}
