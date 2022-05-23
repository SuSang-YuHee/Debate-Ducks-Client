import { MutableRefObject } from "react";
import { Socket } from "socket.io-client";
import Peer from "simple-peer";

import { screenShare } from "./utils/screenShare";
import { toggleAudioMute, toggleVideoMute } from "./utils/toggleMute";

interface IButtonsProps {
  debateId: string | string[] | undefined;
  socket: Socket | undefined;
  peerRef: MutableRefObject<Peer.Instance | undefined>;
  streamRef: MutableRefObject<MediaStream | undefined>;
  videoRef: MutableRefObject<HTMLVideoElement | null>;
  isAudioMuted: boolean;
  setIsAudioMuted: (isMute: boolean) => void;
  isVideoMuted: boolean;
  setIsVideoMuted: (isMute: boolean) => void;
  setIsScreenOn: (isOn: boolean) => void;
}

export default function Buttons({
  debateId,
  socket,
  peerRef,
  streamRef,
  videoRef,
  isAudioMuted,
  setIsAudioMuted,
  isVideoMuted,
  setIsVideoMuted,
  setIsScreenOn,
}: IButtonsProps) {
  return (
    <div>
      <button
        onClick={() =>
          toggleAudioMute(
            debateId,
            socket,
            streamRef,
            setIsAudioMuted,
            isAudioMuted ? false : true,
          )
        }
      >
        {isAudioMuted ? "AudioUnmuted" : "AudioMuted"}
      </button>
      <button
        onClick={() =>
          toggleVideoMute(
            debateId,
            socket,
            streamRef,
            setIsVideoMuted,
            isVideoMuted ? false : true,
          )
        }
      >
        {isVideoMuted ? "VideoUnmuted" : "VideoMuted"}
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
