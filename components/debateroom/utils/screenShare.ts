import { MutableRefObject } from "react";
import Peer from "simple-peer";

export const screenShare = async (
  peerRef: MutableRefObject<Peer.Instance | undefined>,
  streamRef: MutableRefObject<MediaStream | undefined>,
  videoRef: MutableRefObject<HTMLVideoElement | null>,
) => {
  try {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false,
    });

    if (streamRef.current && videoRef.current) {
      if (peerRef.current) {
        peerRef.current.replaceTrack(
          streamRef.current.getVideoTracks()[0],
          screenStream.getVideoTracks()[0],
          streamRef.current,
        );
      }
      videoRef.current.srcObject = screenStream;
    }

    screenStream.getTracks()[0].onended = () => {
      if (streamRef.current && videoRef.current) {
        if (peerRef.current) {
          peerRef.current.replaceTrack(
            screenStream.getVideoTracks()[0],
            streamRef.current.getVideoTracks()[0],
            streamRef.current,
          );
        }
        videoRef.current.srcObject = streamRef.current;
      }
    };
  } catch (err) {
    console.log(err);
  }
};
