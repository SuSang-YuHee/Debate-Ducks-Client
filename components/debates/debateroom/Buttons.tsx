import { screenShare } from "../../../utils/debates/debateroom/screenShare";
import {
  toggleMic,
  toggleReady,
  toggleVideo,
} from "../../../utils/debates/debateroom/toggle";
import { wsTransmitSkip } from "../../../utils/debates/debateroom/webSocket";

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
>) {
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
}
