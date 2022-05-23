import { MutableRefObject } from "react";
import { Socket } from "socket.io-client";

export const toggleAudioMute = (
  debateId: string | string[] | undefined,
  socket: Socket | undefined,
  streamRef: MutableRefObject<MediaStream | undefined>,
  setIsAudioOn: (isMute: boolean) => void,
  isOn: boolean,
) => {
  if (streamRef.current) {
    streamRef.current.getAudioTracks()[0].enabled = isOn;
    setIsAudioOn(isOn);
  }
};

export const toggleVideoMute = (
  debateId: string | string[] | undefined,
  socket: Socket | undefined,
  streamRef: MutableRefObject<MediaStream | undefined>,
  setIsVideoOn: (isOn: boolean) => void,
  isOn: boolean,
) => {
  if (streamRef.current) {
    streamRef.current.getVideoTracks()[0].enabled = isOn;
    setIsVideoOn(isOn);
  }
};
