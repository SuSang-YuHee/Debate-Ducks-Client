import { screenShare } from "./utils/screenShare";
import { toggleAudio, toggleReady, toggleVideo } from "./utils/toggle";

import { IDebateroomProps } from "./types";

export default function Buttons({
  peer,
  streamRef,
  videoRef,
  screenStreamRef,
  isAudioOn,
  setIsAudioOn,
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
  | "peer"
  | "streamRef"
  | "videoRef"
  | "screenStreamRef"
  | "isAudioOn"
  | "setIsAudioOn"
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
        <button
          onClick={() =>
            toggleAudio(streamRef, isAudioOn ? false : true, setIsAudioOn)
          }
        >
          {isAudioOn ? "AudioOn" : "AudioOff"}
        </button>
      )}
      <button
        onClick={() =>
          toggleVideo(streamRef, isVideoOn ? false : true, setIsVideoOn)
        }
      >
        {isVideoOn ? "VideoOn" : "VideoOff"}
      </button>
      {checkScreenDisable() ? null : (
        <button
          onClick={() =>
            screenShare(
              peer,
              streamRef,
              videoRef,
              screenStreamRef,
              setIsScreenOn,
            )
          }
        >
          ScreenShare
        </button>
      )}
      {isStart ? null : (
        <button
          onClick={() => {
            toggleReady(isReady ? false : true, setIsReady);
          }}
        >
          {isReady ? "Cancel" : "Ready"}
        </button>
      )}
    </div>
  );
}
