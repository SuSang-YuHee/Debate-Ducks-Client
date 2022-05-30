import { MutableRefObject } from "react";
import { io, Socket } from "socket.io-client";
import Peer from "simple-peer";

import { connectHostPeer, connectGuestPeer } from "./simple-peer";
import { IDebateData, drawNotice } from "./draw";

//*- Socket and WebRTC 연결
export const wsConnect = (
  debateId: string | string[] | undefined,
  socket: MutableRefObject<Socket | undefined>,
  setPeer: (params: Peer.Instance | undefined) => void,
  canvasRef: MutableRefObject<HTMLCanvasElement | null>,
  streamRef: MutableRefObject<MediaStream | undefined>,
  peerStreamRef: MutableRefObject<MediaStream | undefined>,
  videoRef: MutableRefObject<HTMLVideoElement | null>,
  peerVideoRef: MutableRefObject<HTMLVideoElement | null>,
  setIsPeerVideoOn: (params: boolean) => void,
  setIsPeerScreenOn: (params: boolean) => void,
  setIsStart: (params: boolean) => void,
  setTurn: (
    params: "notice" | "pros" | "cons" | "prosCross" | "consCross",
  ) => void,
  topic: string,
) => {
  console.log("연결"); //!
  if (debateId && socket.current) {
    // * 사용자 미디어 획득
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

    // * 방 입장
    socket.current.emit("join", { debateId });

    // * 방 입장 거절
    socket.current.on("overcapacity", () => {
      console.log("overcapacity"); //!
    });

    // * WebRTC 연결
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

    // * 정보 수신
    socket.current.on("peerVideo", (isPeerVideoOn: boolean) => {
      setIsPeerVideoOn(isPeerVideoOn);
    });

    socket.current.on("peerScreen", (isPeerScreenOn: boolean) => {
      setIsPeerScreenOn(isPeerScreenOn);
    });

    socket.current.on("debateStart", () => {
      setIsStart(true);
    });

    socket.current.on("debateProgress", (debateData: IDebateData) => {
      let turn: "notice" | "pros" | "cons" | "prosCross" | "consCross" =
        "notice";
      if (debateData.turn === 1 || debateData.turn === 5) turn = "pros";
      if (debateData.turn === 3 || debateData.turn === 6) turn = "cons";
      if (debateData.turn === 4) turn = "prosCross";
      if (debateData.turn === 2) turn = "consCross";
      setTurn(turn);
      drawNotice(canvasRef, debateData, topic, turn);
    });

    // * 첫 공지
    drawNotice(
      canvasRef,
      {
        notice: topic,
        turn: -1,
        timer: -1,
      },
      topic,
      "notice",
    );
  }
};

//*- Socket and WebRTC 연결 해제
export const wsDisconnect = (
  socket: MutableRefObject<Socket | undefined>,
  reConnect: boolean,
  setReconnect: (params: boolean) => void,
  peer: Peer.Instance | undefined,
  setPeer: (params: Peer.Instance | undefined) => void,
  peerStreamRef: MutableRefObject<MediaStream | undefined>,
  peerVideoRef: MutableRefObject<HTMLVideoElement | null>,
  screenStreamRef: MutableRefObject<MediaStream | undefined>,
  setIsPeerVideoOn: (params: boolean) => void,
  setIsScreenOn: (params: boolean) => void,
  setIsPeerScreenOn: (params: boolean) => void,
) => {
  socket.current?.on("peerDisconnect", () => {
    peer?.destroy();
    setPeer(undefined);

    socket.current?.disconnect();
    socket.current = io(`${process.env.NEXT_PUBLIC_API_URL}`);

    peerStreamRef.current = undefined;
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

//*- 정보 송신
export const wsTransmitVideo = (
  debateId: string | string[] | undefined,
  socket: MutableRefObject<Socket | undefined>,
  peer: Peer.Instance | undefined,
  isVideoOn: boolean,
) => {
  if (peer) socket.current?.emit("peerVideo", { debateId, isVideoOn });
};

export const wsTransmitScreen = (
  debateId: string | string[] | undefined,
  socket: MutableRefObject<Socket | undefined>,
  peer: Peer.Instance | undefined,
  isScreenOn: boolean,
) => {
  if (peer) socket.current?.emit("peerScreen", { debateId, isScreenOn });
};

export const wsTransmitReady = (
  debateId: string | string[] | undefined,
  socket: MutableRefObject<Socket | undefined>,
  isReady: boolean,
  isPros: boolean,
) => {
  socket.current?.emit("ready", { debateId, isReady, isPros });
};
