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
>) {
  return (
    <div>
      <button
        onClick={() =>
          toggleAudio(streamRef, isAudioOn ? false : true, setIsAudioOn)
        }
      >
        {isAudioOn ? "AudioOff" : "AudioOn"}
      </button>
      <button
        onClick={() =>
          toggleVideo(streamRef, isVideoOn ? false : true, setIsVideoOn)
        }
      >
        {isVideoOn ? "VideoOff" : "VideoOn"}
      </button>
      {isScreenOn ? null : (
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
