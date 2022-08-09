import { IDebateroom } from "../../../types";

export const toggleMic = ({
  streamRef,
  isMicOn,
  setIsMicOn,
}: Pick<IDebateroom, "streamRef" | "isMicOn" | "setIsMicOn">) => {
  if (!streamRef.current) return;
  streamRef.current.getAudioTracks()[0].enabled = isMicOn;
  setIsMicOn(isMicOn);
};

export const toggleVideo = ({
  streamRef,
  isVideoOn,
  setIsVideoOn,
}: Pick<IDebateroom, "streamRef" | "isVideoOn" | "setIsVideoOn">) => {
  if (!streamRef.current) return;
  streamRef.current.getVideoTracks()[0].enabled = isVideoOn;
  setIsVideoOn(isVideoOn);
};

export const toggleReady = ({
  isReady,
  setIsReady,
}: Pick<IDebateroom, "isReady" | "setIsReady">) => {
  setIsReady(isReady);
};
