import { useEffect, useState } from "react";

import { useGetUser } from "../../utils/queries/users";
import { useInput } from "../../utils/common/useInputSelect";

import Filters from "../../components/debates/debates/Filters";
import LikeBtn from "../../components/debates/debates/LikeBtn";
import DebatesHeartList from "../../components/debates/debates/DebatesHeartList";
import DebatesList from "../../components/debates/debates/DebatesList";

export default function Debates() {
  const [statuses, setStatuses] = useState<string[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [order, setOrder] = useState<string>("DESC");
  const [heartOrder, setHeartOrder] = useState<string>("DESC");
  const [isHeartListOn, setIsHeartListOn] = useState<boolean>(false);
  const [isSearchListOn, setIsSearchListOn] = useState<boolean>(false);

  const search = useInput("", "");

  const user = useGetUser();

  useEffect(() => {
    if (!user.data) {
      setHeartOrder("DESC");
      setIsHeartListOn(false);
    }
  }, [user.data]);

  return (
    <div className="inner">
      <Filters
        statuses={statuses}
        setStatuses={setStatuses}
        categories={categories}
        setCategories={setCategories}
      />
      <LikeBtn
        isHeartListOn={isHeartListOn}
        setIsHeartListOn={setIsHeartListOn}
      />
      {isHeartListOn ? (
        <DebatesHeartList
          search={search}
          statuses={statuses}
          categories={categories}
          order={heartOrder}
          setOrder={setHeartOrder}
          isSearchListOn={isSearchListOn}
          setIsSearchListOn={setIsSearchListOn}
        />
      ) : (
        <DebatesList
          search={search}
          statuses={statuses}
          categories={categories}
          order={order}
          setOrder={setOrder}
          isSearchListOn={isSearchListOn}
          setIsSearchListOn={setIsSearchListOn}
        />
      )}
    </div>
  );
}
