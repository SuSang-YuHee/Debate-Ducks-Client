import { screenShare } from "./utils/screenShare";
import { toggleAudioOnOff, toggleVideoOnOff } from "./utils/toggleOnOff";

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
>) {
  return (
    <div>
      <button
        onClick={() =>
          toggleAudioOnOff(streamRef, isAudioOn ? false : true, setIsAudioOn)
        }
      >
        {isAudioOn ? "AudioOff" : "AudioOn"}
      </button>
      <button
        onClick={() =>
          toggleVideoOnOff(streamRef, isVideoOn ? false : true, setIsVideoOn)
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
    </div>
  );
}
