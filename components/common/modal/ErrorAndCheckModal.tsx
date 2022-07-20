import { Dispatch, SetStateAction } from "react";
import ConfirmModal from "./ConfirmModal";

export default function ErrorAndCheckModal({
  isErrorModalOn,
  setIsErrorModalOn,
  isCheckModalOn,
  setIsCheckModalOn,
  errorMessage,
  checkMessage,
  checkCallback,
}: {
  isErrorModalOn: boolean;
  setIsErrorModalOn: Dispatch<SetStateAction<boolean>>;
  isCheckModalOn: boolean;
  setIsCheckModalOn: Dispatch<SetStateAction<boolean>>;
  errorMessage: {
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
      {isErrorModalOn ? (
        <ConfirmModal
          title={errorMessage.title}
          content={errorMessage.content}
          firstBtn="확인"
          firstFunc={() => {
            setIsErrorModalOn(false);
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
