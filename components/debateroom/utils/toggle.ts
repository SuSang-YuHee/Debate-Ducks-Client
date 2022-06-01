export const toggleMic = (
  stream: MediaStream | undefined,
  isMicOn: boolean,
  setIsMicOn: (params: boolean) => void,
) => {
  if (stream) {
    stream.getAudioTracks()[0].enabled = isMicOn;
    setIsMicOn(isMicOn);
  }
};

export const toggleVideo = (
  streamRef: MediaStream | undefined,
  isVideoOn: boolean,
  setIsVideoOn: (params: boolean) => void,
) => {
  if (streamRef) {
    streamRef.getVideoTracks()[0].enabled = isVideoOn;
    setIsVideoOn(isVideoOn);
  }
};

export const toggleReady = (
  isReady: boolean,
  setIsReady: (params: boolean) => void,
) => {
  setIsReady(isReady);
};
