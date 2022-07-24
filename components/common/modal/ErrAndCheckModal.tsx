import { Dispatch, SetStateAction } from "react";
import ConfirmModal from "./ConfirmModal";

export default function ErrAndCheckModal({
  isErrModalOn,
  setIsErrModalOn,
  isCheckModalOn,
  setIsCheckModalOn,
  errMessage,
  checkMessage,
  checkCallback,
}: {
  isErrModalOn: boolean;
  setIsErrModalOn: Dispatch<SetStateAction<boolean>>;
  isCheckModalOn: boolean;
  setIsCheckModalOn: Dispatch<SetStateAction<boolean>>;
  errMessage: {
    title: string;
    content: string;
  };
  checkMessage: {
    title: string;
    content: string;
    firstBtn: string;
    secondBtn: string;
  };
  checkCallback: () => void;
}) {
  return (
    <div>
      {isErrModalOn ? (
        <ConfirmModal
          title={errMessage.title}
          content={errMessage.content}
          firstBtn="확인"
          firstFunc={() => {
            setIsErrModalOn(false);
          }}
        />
      ) : null}
      {isCheckModalOn ? (
        <ConfirmModal
          title={checkMessage.title}
          content={checkMessage.content}
          firstBtn={checkMessage.firstBtn}
          firstFunc={() => {
            setIsCheckModalOn(false);
          }}
          secondBtn={checkMessage.secondBtn}
          secondFunc={checkCallback}
        />
      ) : null}
    </div>
  );
}
