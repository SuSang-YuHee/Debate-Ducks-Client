import { MutableRefObject } from "react";

export const toggleAudioMute = (
  streamRef: MutableRefObject<MediaStream | undefined>,
  setIsAudioMuted: (isMute: boolean) => void,
  isMute: boolean,
) => {
  if (streamRef.current) {
    streamRef.current.getAudioTracks()[0].enabled = !isMute;
    setIsAudioMuted(isMute);
  }
};

export const toggleVideoMute = (
  streamRef: MutableRefObject<MediaStream | undefined>,
  setIsVideoMuted: (isMute: boolean) => void,
  isMute: boolean,
) => {
  if (streamRef.current) {
    streamRef.current.getVideoTracks()[0].enabled = !isMute;
    setIsVideoMuted(isMute);
  }
};
