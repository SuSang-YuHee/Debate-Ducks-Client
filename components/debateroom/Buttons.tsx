import { screenShare } from "./utils/screenShare";
import { toggleAudioMute, toggleVideoMute } from "./utils/toggleMute";

import { IDebateroomProps } from "./types";

export default function Buttons({
  debateId,
  socket,
  peerRef,
  streamRef,
  videoRef,
  isAudioOn,
  setIsAudioOn,
  isVideoOn,
  setIsVideoOn,
  setIsScreenOn,
}: Pick<
  IDebateroomProps,
  | "debateId"
  | "socket"
  | "peerRef"
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
          toggleAudioMute(streamRef, isAudioOn ? false : true, setIsAudioOn)
        }
      >
        {isAudioOn ? "AudioOff" : "AudioOn"}
      </button>
      <button
        onClick={() =>
          toggleVideoMute(
            debateId,
            socket,
            streamRef,
            isVideoOn ? false : true,
            setIsVideoOn,
          )
        }
      >
        {isVideoOn ? "VideoOff" : "VideoOn"}
      </button>
      <button
        onClick={() =>
          screenShare(
            debateId,
            socket,
            peerRef,
            streamRef,
            videoRef,
            setIsScreenOn,
          )
        }
      >
        ScreenShare
      </button>
    </div>
  );
}
