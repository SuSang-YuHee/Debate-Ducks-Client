import { MutableRefObject } from "react";
import Peer from "simple-peer";

//*- 화면 공유
export const screenShare = async (
  peer: Peer.Instance | undefined,
  streamRef: MutableRefObject<MediaStream | undefined>,
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
    if (streamRef.current && videoRef.current) {
      peer?.replaceTrack(
        streamRef.current.getVideoTracks()[0],
        screenStream.getVideoTracks()[0],
        streamRef.current,
      );
      videoRef.current.srcObject = screenStream;
      setIsScreenOn(true);
      screenStreamRef.current = screenStream;
    }

    // * 화면 공유 꺼졌을 때
    screenStream.getTracks()[0].onended = () => {
      if (streamRef.current && videoRef.current) {
        peer?.replaceTrack(
          screenStream.getVideoTracks()[0],
          streamRef.current.getVideoTracks()[0],
          streamRef.current,
        );
        videoRef.current.srcObject = streamRef.current;
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
  peer: Peer.Instance | undefined,
  streamRef: MutableRefObject<MediaStream | undefined>,
  videoRef: MutableRefObject<HTMLVideoElement | null>,
  screenStreamRef: MutableRefObject<MediaStream | undefined>,
  setIsScreenOn: (params: boolean) => void,
) => {
  if (streamRef.current && videoRef.current && screenStreamRef.current) {
    peer?.replaceTrack(
      screenStreamRef.current.getVideoTracks()[0],
      streamRef.current.getVideoTracks()[0],
      streamRef.current,
    );
    screenStreamRef.current.getTracks()[0].stop();
    videoRef.current.srcObject = streamRef.current;
    setIsScreenOn(false);
    screenStreamRef.current = undefined;
  }
};
