import { MutableRefObject } from "react";
import Peer from "simple-peer";

import { toggleAudioMute, toggleVideoMute } from "./utils/toggleMute";
import { screenShare } from "./utils/screenShare";

interface IButtonsProps {
  peerRef: MutableRefObject<Peer.Instance | undefined>;
  myStreamRef: MutableRefObject<MediaStream | undefined>;
  myVideoRef: MutableRefObject<HTMLVideoElement | null>;
  isAudioMuted: boolean;
  setIsAudioMuted: (isMute: boolean) => void;
  isVideoMuted: boolean;
  setIsVideoMuted: (isMute: boolean) => void;
}

export default function Buttons({
  peerRef,
  myStreamRef,
  myVideoRef,
  isAudioMuted,
  setIsAudioMuted,
  isVideoMuted,
  setIsVideoMuted,
}: IButtonsProps) {
  return (
    <div>
      {isAudioMuted ? (
        <button
          onClick={() => toggleAudioMute(myStreamRef, setIsAudioMuted, false)}
        >
          AudioUnmuted
        </button>
      ) : (
        <button
          onClick={() => toggleAudioMute(myStreamRef, setIsAudioMuted, true)}
        >
          AudioMuted
        </button>
      )}
      {isVideoMuted ? (
        <button
          onClick={() => toggleVideoMute(myStreamRef, setIsVideoMuted, false)}
        >
          VideoUnmuted
        </button>
      ) : (
        <button
          onClick={() => toggleVideoMute(myStreamRef, setIsVideoMuted, true)}
        >
          VideoMuted
        </button>
      )}
      <button onClick={() => screenShare(peerRef, myStreamRef, myVideoRef)}>
        ScreenShare
      </button>
    </div>
  );
}
