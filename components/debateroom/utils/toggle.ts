import { MutableRefObject } from "react";

export const toggleMic = (
  streamRef: MutableRefObject<MediaStream | undefined>,
  isMicOn: boolean,
  setIsMicOn: (params: boolean) => void,
) => {
  if (streamRef.current) {
    streamRef.current.getAudioTracks()[0].enabled = isMicOn;
    setIsMicOn(isMicOn);
  }
};

export const toggleVideo = (
  streamRef: MutableRefObject<MediaStream | undefined>,
  isVideoOn: boolean,
  setIsVideoOn: (params: boolean) => void,
) => {
  if (streamRef.current) {
    streamRef.current.getVideoTracks()[0].enabled = isVideoOn;
    setIsVideoOn(isVideoOn);
  }
};

export const toggleReady = (
  isReady: boolean,
  setIsReady: (params: boolean) => void,
) => {
  setIsReady(isReady);
};
