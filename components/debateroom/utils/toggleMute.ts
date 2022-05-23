import { MutableRefObject } from "react";
import { Socket } from "socket.io-client";

export const toggleAudioMute = (
  streamRef: MutableRefObject<MediaStream | undefined>,
  isAudioOn: boolean,
  setIsAudioOn: (isMute: boolean) => void,
) => {
  if (streamRef.current) {
    streamRef.current.getAudioTracks()[0].enabled = isAudioOn;
    setIsAudioOn(isAudioOn);
  }
};

export const toggleVideoMute = (
  debateId: string | string[] | undefined,
  socket: Socket | undefined,
  streamRef: MutableRefObject<MediaStream | undefined>,
  isVideoOn: boolean,
  setIsVideoOn: (isVideoOn: boolean) => void,
) => {
  if (streamRef.current) {
    streamRef.current.getVideoTracks()[0].enabled = isVideoOn;
    setIsVideoOn(isVideoOn);
    socket?.emit("peerVideo", { debateId });
  }
};
