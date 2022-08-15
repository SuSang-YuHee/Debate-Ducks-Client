import { useRouter } from "next/router";
import { Dispatch, SetStateAction } from "react";

import ConfirmModal from "./ConfirmModal";

export default function CheckSignInModal({
  isModalOn,
  setIsModalOn,
}: {
  isModalOn: boolean;
  setIsModalOn: Dispatch<SetStateAction<boolean>>;
}) {
  const router = useRouter();

  return (
    <>
      {isModalOn ? (
        <ConfirmModal
          title={`로그인이 필요한 서비스입니다.`}
          content={`로그인을 하고 서비스를 이용하시겠습니까?`}
          firstBtn={"아니요"}
          firstFunc={() => {
            setIsModalOn(false);
          }}
          secondBtn={"로그인하기"}
          secondFunc={() => router.push("/signin")}
        />
      ) : null}
    </>
  );
}
