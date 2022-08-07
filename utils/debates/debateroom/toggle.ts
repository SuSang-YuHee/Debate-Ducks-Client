import { IDebateroom } from "../../../types";

export const toggleMic = ({
  stream,
  isMicOn,
  setIsMicOn,
}: Pick<IDebateroom, "stream" | "isMicOn" | "setIsMicOn">) => {
  if (!stream) return;
  stream.getAudioTracks()[0].enabled = isMicOn;
  setIsMicOn(isMicOn);
};

export const toggleVideo = ({
  stream,
  isVideoOn,
  setIsVideoOn,
}: Pick<IDebateroom, "stream" | "isVideoOn" | "setIsVideoOn">) => {
  if (!stream) return;
  stream.getVideoTracks()[0].enabled = isVideoOn;
  setIsVideoOn(isVideoOn);
};

export const toggleReady = ({
  isReady,
  setIsReady,
}: Pick<IDebateroom, "isReady" | "setIsReady">) => {
  setIsReady(isReady);
};
