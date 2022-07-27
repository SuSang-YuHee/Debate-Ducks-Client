import { useState } from "react";

import { CATEGORIES } from "../../utils/common/constant";
import { useGetUser } from "../../utils/queries/users";

import CheckBox from "../../components/debates/debates/CheckBox";
import DebatesList from "../../components/debates/debates/DebatesList";
import { useRouter } from "next/router";

export default function Debates() {
  const router = useRouter();
  const [list, setList] = useState<string[]>([]);
  const user = useGetUser();

  return (
    <div>
      {user.data ? (
        <button onClick={() => router.push("/debates/create")}>
          토론 만들기
        </button>
      ) : null}
      <CheckBox candidates={CATEGORIES} list={list} setList={setList} />
      <DebatesList list={list} />
    </div>
  );
}
