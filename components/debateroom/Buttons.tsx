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
  isAudioOn: boolean;
  setIsAudioOn: (isOn: boolean) => void;
  isVideoOn: boolean;
  setIsVideoOn: (isOn: boolean) => void;
  setIsScreenOn: (isOn: boolean) => void;
}

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
}: IButtonsProps) {
  return (
    <div>
      <button
        onClick={() =>
          toggleAudioMute(
            debateId,
            socket,
            streamRef,
            setIsAudioOn,
            isAudioOn ? true : false,
          )
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
            setIsVideoOn,
            isVideoOn ? true : false,
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
