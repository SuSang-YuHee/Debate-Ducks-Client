import { MutableRefObject } from "react";

export const toggleAudioMute = (
  myStreamRef: MutableRefObject<MediaStream | undefined>,
  setIsAudioMuted: (isMute: boolean) => void,
  isMute: boolean,
) => {
  if (myStreamRef.current) {
    myStreamRef.current.getAudioTracks()[0].enabled = !isMute;
    setIsAudioMuted(isMute);
  }
};

export const toggleVideoMute = (
  myStreamRef: MutableRefObject<MediaStream | undefined>,
  setIsVideoMuted: (isMute: boolean) => void,
  isMute: boolean,
) => {
  if (myStreamRef.current) {
    myStreamRef.current.getVideoTracks()[0].enabled = !isMute;
    setIsVideoMuted(isMute);
  }
};
