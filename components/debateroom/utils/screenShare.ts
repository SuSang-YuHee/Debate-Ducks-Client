import { MutableRefObject } from "react";
import Peer from "simple-peer";

//*- 화면 공유
export const screenShare = async (
  peerRef: MutableRefObject<Peer.Instance | undefined>,
  stream: MediaStream | undefined,
  videoRef: MutableRefObject<HTMLVideoElement | null>,
  screenStreamRef: MutableRefObject<MediaStream | undefined>,
  setIsScreenOn: (params: boolean) => void,
) => {
  try {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false,
    });

    // * 화면 공유 켜졌을 때
    if (stream && videoRef.current) {
      peerRef.current?.replaceTrack(
        stream.getVideoTracks()[0],
        screenStream.getVideoTracks()[0],
        stream,
      );
      videoRef.current.srcObject = screenStream;
      setIsScreenOn(true);
      screenStreamRef.current = screenStream;
    }

    // * 화면 공유 꺼졌을 때
    screenStream.getTracks()[0].onended = () => {
      if (stream && videoRef.current) {
        peerRef.current?.replaceTrack(
          screenStream.getVideoTracks()[0],
          stream.getVideoTracks()[0],
          stream,
        );
        videoRef.current.srcObject = stream;
        setIsScreenOn(false);
        screenStreamRef.current = undefined;
      }
    };
  } catch (err) {
    console.log(err);
  }
};

//*- 화면 공유 끄기
export const offScreen = (
  peerRef: MutableRefObject<Peer.Instance | undefined>,
  stream: MediaStream | undefined,
  videoRef: MutableRefObject<HTMLVideoElement | null>,
  screenStreamRef: MutableRefObject<MediaStream | undefined>,
  setIsScreenOn: (params: boolean) => void,
) => {
  if (stream && videoRef.current && screenStreamRef.current) {
    peerRef.current?.replaceTrack(
      screenStreamRef.current.getVideoTracks()[0],
      stream.getVideoTracks()[0],
      stream,
    );
    screenStreamRef.current.getTracks()[0].stop();
    videoRef.current.srcObject = stream;
    setIsScreenOn(false);
    screenStreamRef.current = undefined;
  }
};
