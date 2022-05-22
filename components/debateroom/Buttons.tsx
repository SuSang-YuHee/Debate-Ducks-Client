import { MutableRefObject } from "react";

import { toggleAudioMute, toggleVideoMute } from "./utils/toggleMute";

interface IButtonsProps {
  myStreamRef: MutableRefObject<MediaStream | undefined>;
  isAudioMuted: boolean;
  setIsAudioMuted: (isMute: boolean) => void;
  isVideoMuted: boolean;
  setIsVideoMuted: (isMute: boolean) => void;
}

export default function Buttons({
  myStreamRef,
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
    </div>
  );
}
