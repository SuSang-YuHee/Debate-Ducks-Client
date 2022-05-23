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
          toggleAudioMute(streamRef, isAudioOn ? true : false, setIsAudioOn)
        }
      >
        {isAudioOn ? "AudioOn" : "AudioOff"}
      </button>
      <button
        onClick={() =>
          toggleVideoMute(
            debateId,
            socket,
            streamRef,
            isVideoOn ? true : false,
            setIsVideoOn,
          )
        }
      >
        {isVideoOn ? "VideoOn" : "VideoOff"}
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
