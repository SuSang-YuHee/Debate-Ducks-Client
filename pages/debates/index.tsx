import { useState } from "react";

import { useGetUser } from "../../utils/queries/users";

import Filters from "../../components/debates/debates/Filters";
import DebatesList from "../../components/debates/debates/DebatesList";
import DebatesHeartList from "../../components/debates/debates/DebatesHeartList";

export default function Debates() {
  const [categories, setCategories] = useState<string[]>([]);
  const [statuses, setStatuses] = useState<string[]>([]);
  const [order, setOrder] = useState<string>("DESC");
  const [heartOrder, setHeartOrder] = useState<string>("DESC");
  const [isHeartListOn, setIsHeartListOn] = useState<boolean>(false);
  const user = useGetUser();

  return (
    <div className="inner">
      <Filters
        statuses={statuses}
        setStatuses={setStatuses}
        categories={categories}
        setCategories={setCategories}
      />
      {user.data ? (
        isHeartListOn ? (
          <button onClick={() => setIsHeartListOn(false)}>
            좋아요 리스트 끄기
          </button>
        ) : (
          <button onClick={() => setIsHeartListOn(true)}>
            좋아요 리스트 켜기
          </button>
        )
      ) : null}
      {!isHeartListOn ? (
        <DebatesList list={categories} order={order} setOrder={setOrder} />
      ) : null}
      {isHeartListOn ? (
        <DebatesHeartList
          list={categories}
          order={heartOrder}
          setOrder={setHeartOrder}
        />
      ) : null}
    </div>
  );
}
