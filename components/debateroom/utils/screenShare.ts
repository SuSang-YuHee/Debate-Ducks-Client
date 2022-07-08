import { IDebateroom } from "./../types";

export const screenShare = async ({
  peerRef,
  stream,
  videoRef,
  screenStreamRef,
  setIsScreenOn,
}: Pick<
  IDebateroom,
  "peerRef" | "stream" | "videoRef" | "screenStreamRef" | "setIsScreenOn"
>) => {
  try {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false,
    });

    // * 화면 공유 켜졌을 때
    if (!stream || !videoRef.current) return;

    peerRef.current?.replaceTrack(
      stream.getVideoTracks()[0],
      screenStream.getVideoTracks()[0],
      stream,
    );

    videoRef.current.srcObject = screenStream;
    setIsScreenOn(true);
    screenStreamRef.current = screenStream;

    // * 화면 공유 꺼졌을 때
    screenStream.getTracks()[0].onended = () => {
      if (!stream || !videoRef.current) return;

      peerRef.current?.replaceTrack(
        screenStream.getVideoTracks()[0],
        stream.getVideoTracks()[0],
        stream,
      );

      videoRef.current.srcObject = stream;
      setIsScreenOn(false);
      screenStreamRef.current = undefined;
    };
  } catch (err) {
    console.log(err);
  }
};

export const offScreenShare = ({
  peerRef,
  stream,
  videoRef,
  screenStreamRef,
  setIsScreenOn,
}: Pick<
  IDebateroom,
  "peerRef" | "stream" | "videoRef" | "screenStreamRef" | "setIsScreenOn"
>) => {
  if (!stream || !videoRef.current || !screenStreamRef.current) return;

  peerRef.current?.replaceTrack(
    screenStreamRef.current.getVideoTracks()[0],
    stream.getVideoTracks()[0],
    stream,
  );

  screenStreamRef.current.getTracks()[0].stop();
  videoRef.current.srcObject = stream;
  setIsScreenOn(false);
  screenStreamRef.current = undefined;
};
