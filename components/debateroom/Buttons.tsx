import { screenShare } from "./utils/screenShare";
import { toggleMic, toggleReady, toggleVideo } from "./utils/toggle";
import { wsTransmitSkip } from "./utils/useWebSocket";

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
>) {
  const checkAudioDisable = () => {
    if (turn === "notice") return true;
    if (isPros && turn === "cons") return true;
    if (!isPros && turn === "pros") return true;
    return false;
  };

  const checkScreenDisable = () => {
    if (isScreenOn) return true;
    if (isPros && turn === "cons") return true;
    if (!isPros && turn === "pros") return true;
    return false;
  };

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
      {checkScreenDisable() ? null : (
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
            wsTransmitSkip({ debateId, socket, isPros });
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
}
