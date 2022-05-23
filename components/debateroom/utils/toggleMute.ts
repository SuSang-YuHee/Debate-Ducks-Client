import { MutableRefObject } from "react";
import { Socket } from "socket.io-client";

export const toggleAudioMute = (
  debateId: string | string[] | undefined,
  socket: Socket | undefined,
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
  debateId: string | string[] | undefined,
  socket: Socket | undefined,
  streamRef: MutableRefObject<MediaStream | undefined>,
  setIsVideoMuted: (isMute: boolean) => void,
  isMute: boolean,
) => {
  if (streamRef.current) {
    streamRef.current.getVideoTracks()[0].enabled = !isMute;
    setIsVideoMuted(isMute);
  }
};
