import { MutableRefObject } from "react";
import Peer from "simple-peer";

import { toggleAudioMute, toggleVideoMute } from "./utils/toggleMute";
import { screenShare } from "./utils/screenShare";

interface IButtonsProps {
  peerRef: MutableRefObject<Peer.Instance | undefined>;
  streamRef: MutableRefObject<MediaStream | undefined>;
  videoRef: MutableRefObject<HTMLVideoElement | null>;
  isAudioMuted: boolean;
  setIsAudioMuted: (isMute: boolean) => void;
  isVideoMuted: boolean;
  setIsVideoMuted: (isMute: boolean) => void;
}

export default function Buttons({
  peerRef,
  streamRef,
  videoRef,
  isAudioMuted,
  setIsAudioMuted,
  isVideoMuted,
  setIsVideoMuted,
}: IButtonsProps) {
  return (
    <div>
      {isAudioMuted ? (
        <button
          onClick={() => toggleAudioMute(streamRef, setIsAudioMuted, false)}
        >
          AudioUnmuted
        </button>
      ) : (
        <button
          onClick={() => toggleAudioMute(streamRef, setIsAudioMuted, true)}
        >
          AudioMuted
        </button>
      )}
      {isVideoMuted ? (
        <button
          onClick={() => toggleVideoMute(streamRef, setIsVideoMuted, false)}
        >
          VideoUnmuted
        </button>
      ) : (
        <button
          onClick={() => toggleVideoMute(streamRef, setIsVideoMuted, true)}
        >
          VideoMuted
        </button>
      )}
      <button onClick={() => screenShare(peerRef, streamRef, videoRef)}>
        ScreenShare
      </button>
    </div>
  );
}
