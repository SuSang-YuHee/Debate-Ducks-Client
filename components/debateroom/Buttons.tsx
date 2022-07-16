import { screenShare } from "./utils/screenShare";
import { toggleMic, toggleReady, toggleVideo } from "./utils/toggle";
import { wsTransmitSkip } from "./utils/webSocket";

import { IDebateroom } from "./types";

export default function Buttons({
  debateId,
  socket,
  isPros,
  peerRef,
  stream,
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
  | "socket"
  | "isPros"
  | "peerRef"
  | "stream"
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
          onClick={() => toggleMic({ stream, isMicOn: !isMicOn, setIsMicOn })}
        >
          {isMicOn ? "AudioOn" : "AudioOff"}
        </button>
      )}
      <button
        onClick={() =>
          toggleVideo({ stream, isVideoOn: !isVideoOn, setIsVideoOn })
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
              stream,
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
            wsTransmitSkip({ debateId, socket, isPros, timeRef });
          }}
        >
          Skip Turn
        </button>
      ) : (
        <button
          onClick={() => {
            toggleReady({ isReady: !isReady, setIsReady });
          }}
        >
          {isReady ? "Cancel" : "Ready"}
        </button>
      )}
    </div>
  );

  //*- utils
  function checkAudioDisable() {
    if (turn === "notice") return true;
    if (isPros && turn === "cons") return true;
    if (!isPros && turn === "pros") return true;
    return false;
  }

  function checkScreenShareDisable() {
    if (isScreenOn) return true;
    if (!isStart && isReady) return true;
    if (turn === "notice") return true;
    if (isPros && turn === "cons") return true;
    if (!isPros && turn === "pros") return true;
    return false;
  }
}
