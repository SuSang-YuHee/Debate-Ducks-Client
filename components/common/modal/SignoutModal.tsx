import { Dispatch, SetStateAction } from "react";
import toast from "react-hot-toast";
import { useQueryClient } from "react-query";

import { queryStr } from "../../../utils/queries";

import ConfirmModal from "./ConfirmModal";

export default function SignoutModal({
  isSignoutModalOpen,
  setIsSignoutModalOpen,
}: {
  isSignoutModalOpen: boolean;
  setIsSignoutModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const queryClient = useQueryClient();

  return (
    <>
      {isSignoutModalOpen ? (
        <ConfirmModal
          title="로그아웃"
          content="로그아웃 하시겠습니까?"
          firstBtn="아니요"
          firstFunc={() => {
            setIsSignoutModalOpen(false);
          }}
          secondBtn={"로그아웃"}
          secondFunc={() => {
            setIsSignoutModalOpen(false);
            window.localStorage.removeItem("debate-ducks-token");
            queryClient.setQueryData([queryStr.users], () => null);
            toast.success("로그아웃 되었습니다!");
          }}
        />
      ) : null}
    </>
  );
}
