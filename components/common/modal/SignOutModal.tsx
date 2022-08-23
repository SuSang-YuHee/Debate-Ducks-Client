import { Dispatch, SetStateAction } from "react";
import { useQueryClient } from "react-query";

import { queryKeys } from "../../../utils/queries";

import ConfirmModal from "./ConfirmModal";

export default function SignOutModal({
  isSignOutModalOpen,
  setIsSignOutModalOpen,
}: {
  isSignOutModalOpen: boolean;
  setIsSignOutModalOpen: Dispatch<SetStateAction<boolean>>;
}) {
  const queryClient = useQueryClient();

  return (
    <>
      {isSignOutModalOpen ? (
        <ConfirmModal
          title="로그아웃"
          content="로그아웃 하시겠습니까?"
          firstBtn="아니요"
          firstFunc={() => {
            setIsSignOutModalOpen(false);
          }}
          secondBtn={"로그아웃"}
          secondFunc={() => {
            setIsSignOutModalOpen(false);
            window.localStorage.removeItem("debate-ducks-token");
            queryClient.setQueryData([queryKeys.users], () => null);
          }}
        />
      ) : null}
    </>
  );
}
