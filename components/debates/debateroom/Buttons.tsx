import { useRouter } from "next/router";

import { screenShare } from "../../../utils/debates/debateroom/screenShare";
import {
  toggleMic,
  toggleReady,
  toggleVideo,
} from "../../../utils/debates/debateroom/toggle";
import { wsTransmitSkip } from "../../../utils/debates/debateroom/webSocket";
import { offScreenShare } from "../../../utils/debates/debateroom/screenShare";

import { IDebateroom } from "../../../types";

export default function Buttons({
  debateId,
  socketRef,
  isPros,
  peerRef,
  streamRef,
  peerStream,
  videoRef,
  screenStreamRef,
  isMicOn,
  setIsMicOn,
  isVideoOn,
  setIsVideoOn,
  isScreenOn,
  setIsScreenOn,
  isReady,
  setIsReady,
  isStart,
  turn,
  timeRef,
  recorderRef,
}: Pick<
  IDebateroom,
  | "debateId"
  | "socketRef"
  | "isPros"
  | "peerRef"
  | "streamRef"
  | "peerStream"
  | "videoRef"
  | "screenStreamRef"
  | "isMicOn"
  | "setIsMicOn"
  | "isVideoOn"
  | "setIsVideoOn"
  | "isScreenOn"
  | "setIsScreenOn"
  | "isReady"
  | "setIsReady"
  | "isStart"
  | "turn"
  | "timeRef"
  | "recorderRef"
>) {
  const router = useRouter();

  return (
    <div>
      {checkAudioDisable() ? (
        "AudioOff"
      ) : (
        <button
          onClick={() =>
            toggleMic({ streamRef, isMicOn: !isMicOn, setIsMicOn })
          }
        >
          {isMicOn ? "AudioOn" : "AudioOff"}
        </button>
      )}
      <button
        onClick={() =>
          toggleVideo({ streamRef, isVideoOn: !isVideoOn, setIsVideoOn })
        }
      >
        {isVideoOn ? "VideoOn" : "VideoOff"}
      </button>
      {checkScreenShareDisable() ? (
        "ScreenShare X"
      ) : (
        <button
          onClick={() =>
            screenShare({
              peerRef,
              streamRef,
              videoRef,
              screenStreamRef,
              setIsScreenOn,
            })
          }
        >
          ScreenShare
        </button>
      )}
      {isStart ? (
        <button
          onClick={() => {
            wsTransmitSkip({ debateId, socketRef, isPros, turn, timeRef });
          }}
        >
          Skip Turn
        </button>
      ) : peerStream ? (
        <button
          onClick={() => {
            toggleReady({ isReady: !isReady, setIsReady });
          }}
        >
          {isReady ? "Cancel" : "Ready"}
        </button>
      ) : (
        "사용못함"
      )}
      <div onClick={handleExit}>나가기</div>
    </div>
  );

  //*- utils
  function checkAudioDisable() {
    if (turn === "notice") return true;
    return false;
  }

  function checkScreenShareDisable() {
    if (!peerStream) return true;
    if (isScreenOn) return true;
    if (!isStart && isReady) return true;
    if (turn === "notice") return true;
    if (isPros && turn === "cons") return true;
    if (!isPros && turn === "pros") return true;
    return false;
  }

  function handleExit() {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current?.stop();
    }
    offScreenShare({
      peerRef,
      streamRef,
      videoRef,
      screenStreamRef,
      setIsScreenOn,
    });
    streamRef.current?.getTracks().forEach((track) => {
      track.stop();
    });
    peerRef.current?.destroy();
    peerRef.current = undefined;
    socketRef.current.disconnect();
    router.push(`/${debateId}`);
  }
}
