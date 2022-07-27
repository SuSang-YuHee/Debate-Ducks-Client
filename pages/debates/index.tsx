import { useState } from "react";
import { useRouter } from "next/router";

import { CATEGORIES } from "../../utils/common/constant";
import { useGetUser } from "../../utils/queries/users";

import CheckBox from "../../components/debates/debates/CheckBox";
import DebatesList from "../../components/debates/debates/DebatesList";
import DebatesHeartList from "../../components/debates/debates/DebatesHeartList";

export default function Debates() {
  const router = useRouter();
  const [list, setList] = useState<string[]>([]);
  const [order, setOrder] = useState<string>("DESC");
  const [heartOrder, setHeartOrder] = useState<string>("DESC");
  const [isHeartListOn, setIsHeartListOn] = useState<boolean>(false);
  const user = useGetUser();

  console.log(order);

  return (
    <div>
      {user.data ? (
        <button onClick={() => router.push("/debates/create")}>
          토론 만들기
        </button>
      ) : null}
      <CheckBox candidates={CATEGORIES} list={list} setList={setList} />
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
        <DebatesList list={list} order={order} setOrder={setOrder} />
      ) : null}
      {isHeartListOn ? (
        <DebatesHeartList
          list={list}
          order={heartOrder}
          setOrder={setHeartOrder}
        />
      ) : null}
    </div>
  );
}
