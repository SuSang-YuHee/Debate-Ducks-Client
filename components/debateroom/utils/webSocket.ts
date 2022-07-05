import { MutableRefObject } from "react";
import { io, Socket } from "socket.io-client";
import Peer from "simple-peer";

import { connectHostPeer, connectGuestPeer } from "./simple-peer";
import { IDebateData, drawNotice } from "./draw";
import { beep } from "./beep";

//*- Socket and WebRTC 연결
export const wsConnect = async (
  debateId: string | string[] | undefined,
  socket: MutableRefObject<Socket | undefined>,
  isPros: boolean,
  peerRef: MutableRefObject<Peer.Instance | undefined>,
  canvasRef: MutableRefObject<HTMLCanvasElement | null>,
  setStream: (params: MediaStream | undefined) => void,
  setPeerStream: (params: MediaStream | undefined) => void,
  videoRef: MutableRefObject<HTMLVideoElement | null>,
  peerVideoRef: MutableRefObject<HTMLVideoElement | null>,
  setIsPeerVideoOn: (params: boolean) => void,
  setIsPeerScreenOn: (params: boolean) => void,
  setIsStart: (params: boolean) => void,
  setTurn: (
    params: "none" | "notice" | "pros" | "cons" | "prosCross" | "consCross",
  ) => void,
  setIsRecorder: (params: boolean) => void,
  topic: string,
) => {
  if (debateId && socket.current) {
    // * 사용자 미디어 획득
    const stream = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: "user", width: 500, height: 500 },
      audio: { echoCancellation: true, noiseSuppression: true },
    });

    // * 사용자 미디어 저장 및 비디오로 표시
    setStream(stream);
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }

    // * 방 입장
    socket.current.emit("join", { debateId, isPros });

    // * 방 입장 거절
    socket.current.on("overcapacity", () => {
      console.log("overcapacity"); //!
    });

    // * WebRTC 연결
    socket.current.on("guestJoin", () => {
      connectHostPeer(
        debateId,
        socket,
        peerRef,
        stream,
        setPeerStream,
        peerVideoRef,
      );
    });

    socket.current.on("offer", (signal: Peer.SignalData) => {
      connectGuestPeer(
        debateId,
        socket,
        peerRef,
        stream,
        setPeerStream,
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
      let turn:
        | "none"
        | "notice"
        | "pros"
        | "cons"
        | "prosCross"
        | "consCross" = "notice";
      if (debateData.turn === 7 && debateData.timer < 0) {
        socket.current?.emit("debateDone", { debateId });
      } else {
        if (debateData.turn === 1 || debateData.turn === 5) turn = "pros";
        if (debateData.turn === 3 || debateData.turn === 6) turn = "cons";
        if (debateData.turn === 4) turn = "prosCross";
        if (debateData.turn === 2) turn = "consCross";
        setTurn(turn);
        drawNotice(canvasRef, debateData, topic, turn);
        if (debateData.timer === 10 || debateData.timer === 1) beep();
      }
    });

    socket.current.on("recorder", () => {
      setIsRecorder(true);
    });

    // * 기본 공지
    drawNotice(
      canvasRef,
      {
        notice: topic,
        turn: -1,
        timer: -1,
      },
      topic,
      "none",
    );
  }
};

//*- Socket and WebRTC 연결 해제
export const wsDisconnect = (
  socket: MutableRefObject<Socket | undefined>,
  reConnect: boolean,
  setReconnect: (params: boolean) => void,
  peerRef: MutableRefObject<Peer.Instance | undefined>,
  setPeerStream: (params: MediaStream | undefined) => void,
  peerVideoRef: MutableRefObject<HTMLVideoElement | null>,
  screenStreamRef: MutableRefObject<MediaStream | undefined>,
  setIsPeerVideoOn: (params: boolean) => void,
  setIsScreenOn: (params: boolean) => void,
  setIsPeerScreenOn: (params: boolean) => void,
) => {
  socket.current?.on("peerDisconnect", () => {
    // * Peer 파괴
    peerRef.current?.destroy();
    peerRef.current = undefined;

    // * Socket 연결 해제 및 재연결
    socket.current?.disconnect();
    socket.current = io(`${process.env.NEXT_PUBLIC_API_URL}`);

    // * Peer 관련 정보 초기화
    setPeerStream(undefined);
    if (peerVideoRef.current) peerVideoRef.current.srcObject = null;
    setIsPeerVideoOn(false);
    setIsPeerScreenOn(false);

    // * 화면 공유 끄기
    setIsScreenOn(false);
    if (screenStreamRef.current) {
      screenStreamRef.current.getTracks()[0].stop();
    }

    setReconnect(!reConnect);
  });
};

//*- 정보 송신
export const wsTransmitVideo = (
  debateId: string | string[] | undefined,
  socket: MutableRefObject<Socket | undefined>,
  peerRef: MutableRefObject<Peer.Instance | undefined>,
  isVideoOn: boolean,
) => {
  if (peerRef.current)
    socket.current?.emit("peerVideo", { debateId, isVideoOn });
};

export const wsTransmitScreen = (
  debateId: string | string[] | undefined,
  socket: MutableRefObject<Socket | undefined>,
  peerRef: MutableRefObject<Peer.Instance | undefined>,
  isScreenOn: boolean,
) => {
  if (peerRef.current)
    socket.current?.emit("peerScreen", { debateId, isScreenOn });
};

export const wsTransmitReady = (
  debateId: string | string[] | undefined,
  socket: MutableRefObject<Socket | undefined>,
  isPros: boolean,
  isReady: boolean,
) => {
  socket.current?.emit("ready", { debateId, isReady, isPros });
};

export const wsTransmitSkip = (
  debateId: string | string[] | undefined,
  socket: MutableRefObject<Socket | undefined>,
  isPros: boolean,
) => {
  socket.current?.emit("skip", { debateId, isPros });
};
