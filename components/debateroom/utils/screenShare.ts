import { MutableRefObject } from "react";
import Peer from "simple-peer";

export const screenShare = async (
  peerRef: MutableRefObject<Peer.Instance | undefined>,
  myStreamRef: MutableRefObject<MediaStream | undefined>,
  myVideoRef: MutableRefObject<HTMLVideoElement | null>,
) => {
  try {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: false,
    });

    if (myStreamRef.current && myVideoRef.current) {
      if (peerRef.current) {
        peerRef.current.replaceTrack(
          myStreamRef.current.getVideoTracks()[0],
          screenStream.getVideoTracks()[0],
          myStreamRef.current,
        );
      }
      myVideoRef.current.srcObject = screenStream;
    }

    screenStream.getTracks()[0].onended = () => {
      if (myStreamRef.current && myVideoRef.current) {
        if (peerRef.current) {
          peerRef.current.replaceTrack(
            screenStream.getVideoTracks()[0],
            myStreamRef.current.getVideoTracks()[0],
            myStreamRef.current,
          );
        }
        myVideoRef.current.srcObject = myStreamRef.current;
      }
    };
  } catch (err) {
    console.log(err);
  }
};
