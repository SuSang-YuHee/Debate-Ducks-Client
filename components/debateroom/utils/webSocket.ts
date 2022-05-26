import { MutableRefObject } from "react";
import { io, Socket } from "socket.io-client";
import Peer from "simple-peer";

import { connectHostPeer, connectGuestPeer } from "./simple-peer";

//* Room and WebRTC 연결
export const wsConnect = (
  debateId: string | string[] | undefined,
  socket: MutableRefObject<Socket | undefined>,
  setPeer: (peer: Peer.Instance | undefined) => void,
  streamRef: MutableRefObject<MediaStream | undefined>,
  peerStreamRef: MutableRefObject<MediaStream | undefined>,
  videoRef: MutableRefObject<HTMLVideoElement | null>,
  peerVideoRef: MutableRefObject<HTMLVideoElement | null>,
  setIsPeerVideoOn: (isVideoOn: boolean) => void,
  setIsPeerScreenOn: (isScreenON: boolean) => void,
) => {
  if (debateId && socket.current) {
    //* 사용자 미디어 획득
    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: "user", width: 500, height: 500 },
        audio: { echoCancellation: true, noiseSuppression: true },
      })
      .then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      });

    //* 방 입장
    socket.current.emit("join", { debateId });

    //* 방 입장 거절
    socket.current.on("overcapacity", () => {
      console.log("overcapacity"); //! 추가 처리 필요
    });

    //* offer and answer
    socket.current.on("guestJoin", () => {
      connectHostPeer(
        debateId,
        socket,
        setPeer,
        streamRef,
        peerStreamRef,
        peerVideoRef,
      );
    });

    socket.current.on("offer", (signal: Peer.SignalData) => {
      connectGuestPeer(
        debateId,
        socket,
        setPeer,
        streamRef,
        peerStreamRef,
        peerVideoRef,
        signal,
      );
    });

    //* 정보 수신
    socket.current.on("peerVideo", (isPeerVideoOn: boolean) => {
      setIsPeerVideoOn(isPeerVideoOn);
    });

    socket.current.on("peerScreen", (isPeerScreenOn: boolean) => {
      setIsPeerScreenOn(isPeerScreenOn);
    });
  }
};

//* Room and WebRTC 연결 해제
export const wsDisconnect = (
  socket: MutableRefObject<Socket | undefined>,
  reConnect: boolean,
  setReconnect: (reConnect: boolean) => void,
  peer: Peer.Instance | undefined,
  setPeer: (peer: Peer.Instance | undefined) => void,
  streamRef: MutableRefObject<MediaStream | undefined>,
  peerStreamRef: MutableRefObject<MediaStream | undefined>,
  videoRef: MutableRefObject<HTMLVideoElement | null>,
  peerVideoRef: MutableRefObject<HTMLVideoElement | null>,
  screenStreamRef: MutableRefObject<MediaStream | undefined>,
  setIsPeerVideoOn: (isVideoOn: boolean) => void,
  setIsScreenOn: (isScreenON: boolean) => void,
  setIsPeerScreenOn: (isScreenON: boolean) => void,
) => {
  socket.current?.on("peerDisconnect", () => {
    peer?.destroy();
    setPeer(undefined);
    socket.current?.disconnect();
    socket.current = io(`${process.env.NEXT_PUBLIC_API_URL}`);

    streamRef.current = undefined;
    peerStreamRef.current = undefined;
    if (videoRef.current) videoRef.current.srcObject = null;
    if (peerVideoRef.current) peerVideoRef.current.srcObject = null;
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks()[0].stop();
    }
    setIsPeerVideoOn(false);
    setIsScreenOn(false);
    setIsPeerScreenOn(false);

    setReconnect(!reConnect);
  });
};

//* 정보 송신
export const wsTransmit = (
  debateId: string | string[] | undefined,
  socket: MutableRefObject<Socket | undefined>,
  peer: Peer.Instance | undefined,
  isVideoOn: boolean,
  isScreenOn: boolean,
) => {
  if (peer) {
    socket.current?.emit("peerVideo", { debateId, isVideoOn });
    socket.current?.emit("peerScreen", { debateId, isScreenOn });
  }
};
