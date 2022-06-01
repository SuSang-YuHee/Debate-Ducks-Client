import { screenShare } from "./utils/screenShare";
import { toggleMic, toggleReady, toggleVideo } from "./utils/toggle";
import { wsTransmitSkip } from "./utils/webSocket";

import { IDebateroomProps } from "./types";

export default function Buttons({
  debateId,
  socket,
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
  isPros,
}: Pick<
  IDebateroomProps,
  | "debateId"
  | "socket"
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
  | "isPros"
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
        <button onClick={() => toggleMic(stream, !isMicOn, setIsMicOn)}>
          {isMicOn ? "AudioOn" : "AudioOff"}
        </button>
      )}
      <button onClick={() => toggleVideo(stream, !isVideoOn, setIsVideoOn)}>
        {isVideoOn ? "VideoOn" : "VideoOff"}
      </button>
      {checkScreenDisable() ? null : (
        <button
          onClick={() =>
            screenShare(
              peerRef,
              stream,
              videoRef,
              screenStreamRef,
              setIsScreenOn,
            )
          }
        >
          ScreenShare
        </button>
      )}
      {isStart ? (
        <button
          onClick={() => {
            wsTransmitSkip(debateId, socket, isPros);
          }}
        >
          Skip Turn
        </button>
      ) : (
        <button
          onClick={() => {
            toggleReady(!isReady, setIsReady);
          }}
        >
          {isReady ? "Cancel" : "Ready"}
        </button>
      )}
    </div>
  );
}
