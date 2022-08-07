import { IDebateroom } from "../../../types";

export const screenShare = async ({
  peerRef,
  streamRef,
  videoRef,
  screenStreamRef,
  setIsScreenOn,
}: Pick<
  IDebateroom,
  "peerRef" | "streamRef" | "videoRef" | "screenStreamRef" | "setIsScreenOn"
>) => {
  try {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false,
    });

    //* 화면 공유 켜졌을 때
    if (!streamRef.current || !videoRef.current) return;

    peerRef.current?.replaceTrack(
      streamRef.current.getVideoTracks()[0],
      screenStream.getVideoTracks()[0],
      streamRef.current,
    );

    videoRef.current.srcObject = screenStream;
    setIsScreenOn(true);
    screenStreamRef.current = screenStream;

    //* 화면 공유 꺼졌을 때
    screenStream.getTracks()[0].onended = () => {
      if (!streamRef.current || !videoRef.current) return;

      peerRef.current?.replaceTrack(
        screenStream.getVideoTracks()[0],
        streamRef.current.getVideoTracks()[0],
        streamRef.current,
      );

      videoRef.current.srcObject = streamRef.current;
      setIsScreenOn(false);
      screenStreamRef.current = undefined;
    };
  } catch (err) {
    console.log(err);
  }
};

export const offScreenShare = ({
  peerRef,
  streamRef,
  videoRef,
  screenStreamRef,
  setIsScreenOn,
}: Pick<
  IDebateroom,
  "peerRef" | "streamRef" | "videoRef" | "screenStreamRef" | "setIsScreenOn"
>) => {
  if (!streamRef.current || !videoRef.current || !screenStreamRef.current)
    return;

  peerRef.current?.replaceTrack(
    screenStreamRef.current.getVideoTracks()[0],
    streamRef.current.getVideoTracks()[0],
    streamRef.current,
  );

  screenStreamRef.current.getTracks()[0].stop();
  videoRef.current.srcObject = streamRef.current;
  setIsScreenOn(false);
  screenStreamRef.current = undefined;
};
