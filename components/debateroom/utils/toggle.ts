import { MutableRefObject } from "react";

export const toggleAudio = (
  streamRef: MutableRefObject<MediaStream | undefined>,
  isAudioOn: boolean,
  setIsAudioOn: (params: boolean) => void,
) => {
  if (streamRef.current) {
    streamRef.current.getAudioTracks()[0].enabled = isAudioOn;
    setIsAudioOn(isAudioOn);
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
