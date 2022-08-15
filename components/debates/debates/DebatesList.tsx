import { useGetDebates } from "../../../utils/queries/debates";
import { useSelect } from "../../../utils/common/useInputSelect";

import DebatesCards from "./DebatesCards";

import { UseInputResult } from "../../../types";

export default function DebatesList({
  search,
  statuses,
  categories,
  order,
  setOrder,
  isSearchListOn,
  setIsSearchListOn,
}: {
  search: UseInputResult;
  statuses: string[];
  categories: string[];
  order: string;
  setOrder: (params: string) => void;
  isSearchListOn: boolean;
  setIsSearchListOn: (params: boolean) => void;
}) {
  const orderSelect = useSelect(order, refetch, setOrder);

  const debates = useGetDebates(search.value, orderSelect.value);

  function refetch() {
    setTimeout(() => debates.refetch(), 1);
  }

  return (
    <DebatesCards
      statuses={statuses}
      categories={categories}
      isDisabledSearch={false}
      debates={debates}
      refetch={refetch}
      search={search}
      orderSelect={orderSelect}
      isSearchListOn={isSearchListOn}
      setIsSearchListOn={setIsSearchListOn}
    />
  );
}
