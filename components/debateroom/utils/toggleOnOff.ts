import { MutableRefObject } from "react";

export const toggleAudioOnOff = (
  streamRef: MutableRefObject<MediaStream | undefined>,
  isAudioOn: boolean,
  setIsAudioOn: (isMute: boolean) => void,
) => {
  if (streamRef.current) {
    streamRef.current.getAudioTracks()[0].enabled = isAudioOn;
    setIsAudioOn(isAudioOn);
  }
};

export const toggleVideoOnOff = (
  streamRef: MutableRefObject<MediaStream | undefined>,
  isVideoOn: boolean,
  setIsVideoOn: (isVideoOn: boolean) => void,
) => {
  if (streamRef.current) {
    streamRef.current.getVideoTracks()[0].enabled = isVideoOn;
    setIsVideoOn(isVideoOn);
  }
};
