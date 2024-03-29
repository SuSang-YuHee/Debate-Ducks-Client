import { useGetDebatesHeart } from "../../../utils/queries/debates";
import { useSelect } from "../../../utils/common/useInputSelect";
import { useGetUser } from "../../../utils/queries/users";

import DebatesCards from "./DebatesCards";

import { IUseInputResult } from "../../../types";

export default function DebatesHeartList({
  search,
  statuses,
  categories,
  order,
  setOrder,
  isSearchListOn,
  setIsSearchListOn,
}: {
  search: IUseInputResult;
  statuses: string[];
  categories: string[];
  order: string;
  setOrder: (params: string) => void;
  isSearchListOn: boolean;
  setIsSearchListOn: (params: boolean) => void;
}) {
  const orderSelect = useSelect(order, refetch, setOrder);

  const user = useGetUser();
  const debates = useGetDebatesHeart(user.data?.id || "", orderSelect.value);

  function refetch() {
    setTimeout(() => debates.refetch(), 1);
  }

  return (
    <DebatesCards
      statuses={statuses}
      categories={categories}
      isDisabledSearch={true}
      debates={debates}
      refetch={refetch}
      search={search}
      orderSelect={orderSelect}
      isSearchListOn={isSearchListOn}
      setIsSearchListOn={setIsSearchListOn}
    />
  );
}
