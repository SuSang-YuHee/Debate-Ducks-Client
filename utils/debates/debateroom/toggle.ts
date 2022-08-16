import { IDebateroom } from "../../../types";

//*- 마이크 끄기/켜기
export const toggleMic = ({
  streamRef,
  isMicOn,
  setIsMicOn,
}: Pick<IDebateroom, "streamRef" | "isMicOn" | "setIsMicOn">) => {
  if (!streamRef.current) return;
  streamRef.current.getAudioTracks()[0].enabled = isMicOn;
  setIsMicOn(isMicOn);
};

//*- 비디오 끄기/켜기
export const toggleVideo = ({
  streamRef,
  isVideoOn,
  setIsVideoOn,
}: Pick<IDebateroom, "streamRef" | "isVideoOn" | "setIsVideoOn">) => {
  if (!streamRef.current) return;
  streamRef.current.getVideoTracks()[0].enabled = isVideoOn;
  setIsVideoOn(isVideoOn);
};

//*- 준비 하기/취소
export const toggleReady = ({
  isReady,
  setIsReady,
}: Pick<IDebateroom, "isReady" | "setIsReady">) => {
  setIsReady(isReady);
};
