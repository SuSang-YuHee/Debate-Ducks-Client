import { screenShare } from "./utils/screenShare";
import { toggleAudioOnOff, toggleVideoOnOff } from "./utils/toggleOnOff";

import { IDebateroomProps } from "./types";

export default function Buttons({
  peer,
  streamRef,
  videoRef,
  isAudioOn,
  setIsAudioOn,
  isVideoOn,
  setIsVideoOn,
  setIsScreenOn,
}: Pick<
  IDebateroomProps,
  | "peer"
  | "streamRef"
  | "videoRef"
  | "isAudioOn"
  | "setIsAudioOn"
  | "isVideoOn"
  | "setIsVideoOn"
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
      <button
        onClick={() => screenShare(peer, streamRef, videoRef, setIsScreenOn)}
      >
        ScreenShare
      </button>
    </div>
  );
}
