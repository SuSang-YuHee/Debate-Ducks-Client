import { useState } from "react";
import { useRouter } from "next/router";

import { CATEGORIES } from "../../utils/common/constant";
import { useGetUser } from "../../utils/queries/users";
import { useInput } from "../../utils/common/useInputSelect";

import CheckBox from "../../components/debates/debates/CheckBox";
import DebatesList from "../../components/debates/debates/DebatesList";
import DebatesHeartList from "../../components/debates/debates/DebatesHeartList";
import DebatesSearchList from "../../components/debates/debates/DebatesSearchList";

export default function Debates() {
  const router = useRouter();
  const [list, setList] = useState<string[]>([]);
  const [isHeartListOn, setIsHeartListOn] = useState<boolean>(false);
  const [isSearchListOn, setIsSearchListOn] = useState<boolean>(false);
  const user = useGetUser();
  const search = useInput("", "");

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
      {isSearchListOn ? (
        <div>
          <input {...search.attribute} disabled />
          <button
            onClick={() => {
              setIsSearchListOn(false);
            }}
          >
            X
          </button>
        </div>
      ) : (
        <div>
          <input {...search.attribute} />
          <button
            onClick={() => {
              setIsSearchListOn(true);
            }}
          >
            검색
          </button>
        </div>
      )}
      {!isHeartListOn && !isSearchListOn ? <DebatesList list={list} /> : null}
      {isHeartListOn ? <DebatesHeartList list={list} /> : null}
      {isSearchListOn ? (
        <DebatesSearchList list={list} searchValue={search.value} />
      ) : null}
    </div>
  );
}
