import { MutableRefObject } from "react";
import Peer from "simple-peer";

export const screenShare = async (
  peer: Peer.Instance | undefined,
  streamRef: MutableRefObject<MediaStream | undefined>,
  videoRef: MutableRefObject<HTMLVideoElement | null>,
  setIsScreenOn: (isOn: boolean) => void,
) => {
  try {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false,
    });

    if (streamRef.current && videoRef.current) {
      peer?.replaceTrack(
        streamRef.current.getVideoTracks()[0],
        screenStream.getVideoTracks()[0],
        streamRef.current,
      );
      videoRef.current.srcObject = screenStream;
      setIsScreenOn(true);
    }

    screenStream.getTracks()[0].onended = () => {
      if (streamRef.current && videoRef.current) {
        peer?.replaceTrack(
          screenStream.getVideoTracks()[0],
          streamRef.current.getVideoTracks()[0],
          streamRef.current,
        );
        videoRef.current.srcObject = streamRef.current;
        setIsScreenOn(false);
      }
    };
  } catch (err) {
    console.log(err);
  }
};
