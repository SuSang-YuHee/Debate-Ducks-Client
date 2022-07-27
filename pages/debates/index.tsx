import { useState } from "react";

import { CATEGORIES } from "../../utils/common/constant";
import { useGetUser } from "../../utils/queries/users";

import CheckBox from "../../components/debates/debates/CheckBox";
import DebatesList from "../../components/debates/debates/DebatesList";
import DebatesHeartList from "../../components/debates/debates/DebatesHeartList";
import { useRouter } from "next/router";

export default function Debates() {
  const router = useRouter();
  const [list, setList] = useState<string[]>([]);
  const [isHeartListOn, setIsHeartListOn] = useState<boolean>(false);
  const user = useGetUser();

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
      {!isHeartListOn ? <DebatesList list={list} /> : null}
      {isHeartListOn ? <DebatesHeartList list={list} /> : null}
    </div>
  );
}
