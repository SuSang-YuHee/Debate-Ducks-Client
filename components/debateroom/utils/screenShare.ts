import { MutableRefObject } from "react";
import { Socket } from "socket.io-client";
import Peer from "simple-peer";

export const screenShare = async (
  debateId: string | string[] | undefined,
  socket: Socket | undefined,
  peerRef: MutableRefObject<Peer.Instance | undefined>,
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
      if (peerRef.current) {
        peerRef.current.replaceTrack(
          streamRef.current.getVideoTracks()[0],
          screenStream.getVideoTracks()[0],
          streamRef.current,
        );
      }
      videoRef.current.srcObject = screenStream;
      setIsScreenOn(true);
      //! 소켓 추가 필요
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
        setIsScreenOn(false);
        //! 소켓 추가 필요
      }
    };
  } catch (err) {
    console.log(err);
  }
};
