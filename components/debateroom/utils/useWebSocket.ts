import { useEffect } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

import { connectHostPeer, connectGuestPeer } from "./simple-peer";
import { drawNotice } from "./draw";
import { beep } from "./beep";
import { offScreenShare } from "./screenShare";

import { IDebateroom, IDebateData } from "../types";

export const useWebSocket = ({
  debateId,
  socket,
  isPros,
  reConnect,
  setReconnect,
  peerRef,
  canvasRef,
  stream,
  setStream,
  peerStream,
  setPeerStream,
  videoRef,
  peerVideoRef,
  screenStreamRef,
  isVideoOn,
  setIsPeerVideoOn,
  isScreenOn,
  setIsScreenOn,
  setIsPeerScreenOn,
  isReady,
  setIsReady,
  setIsStart,
  setTurn,
  dummy,
}: Pick<
  IDebateroom,
  | "debateId"
  | "socket"
  | "isPros"
  | "reConnect"
  | "setReconnect"
  | "peerRef"
  | "canvasRef"
  | "stream"
  | "setStream"
  | "peerStream"
  | "setPeerStream"
  | "videoRef"
  | "peerVideoRef"
  | "screenStreamRef"
  | "isVideoOn"
  | "setIsPeerVideoOn"
  | "isScreenOn"
  | "setIsScreenOn"
  | "setIsPeerScreenOn"
  | "isReady"
  | "setIsReady"
  | "setIsStart"
  | "setTurn"
  | "dummy"
>) => {
  //*- 연결
  useEffect(() => {
    if (!debateId) return;

    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: "user", width: 500, height: 500 },
        audio: { echoCancellation: true, noiseSuppression: true },
      })
      .then((stream) => {
        setStream(stream);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }

        socket.current?.emit("join", { debateId });

        socket.current?.on("overcapacity", () => {
          console.log("overcapacity"); //! 입장 실패 모달 필요
        });

        socket.current?.on("guestJoin", () => {
          connectHostPeer({
            debateId,
            socket,
            peerRef,
            stream,
            setPeerStream,
            peerVideoRef,
          });
        });

        socket.current?.on("offer", (signal: Peer.SignalData) => {
          connectGuestPeer(
            { debateId, socket, peerRef, stream, setPeerStream, peerVideoRef },
            signal,
          );
        });
      });

    // * 정보 수신
    socket.current?.on("peerVideo", (isPeerVideoOn: boolean) => {
      setIsPeerVideoOn(isPeerVideoOn);
    });

    socket.current?.on("peerScreen", (isPeerScreenOn: boolean) => {
      setIsPeerScreenOn(isPeerScreenOn);
    });

    socket.current?.on("debateStart", () => {
      setIsStart(true);
    });

    // * 최초 공지
    drawNotice(
      { canvasRef, turn: "none" },
      {
        notice: dummy.topic,
        turn: -1,
        timer: -1,
      },
      dummy.topic,
    );

    // * 토론 진행 및 공지
    socket.current?.on("debate", (debateData: IDebateData) => {
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
        drawNotice({ canvasRef, turn }, debateData, dummy.topic);
        if (debateData.timer === 10 || debateData.timer === 1) beep();
      }
    });
  }, [
    debateId,
    socket,
    canvasRef,
    setStream,
    videoRef,
    peerRef,
    setPeerStream,
    peerVideoRef,
    setIsPeerVideoOn,
    setIsPeerScreenOn,
    setIsStart,
    setTurn,
    dummy.topic,
    reConnect,
  ]); // dependency로 reConnect 필요

  //*- 연결 해제
  useEffect(() => {
    socket.current?.on("peerDisconnect", () => {
      if (peerVideoRef.current) {
        peerVideoRef.current.srcObject = null;
      }
      setPeerStream(undefined);
      setIsPeerVideoOn(false);
      setIsPeerScreenOn(false);
      setIsReady(false);

      offScreenShare({
        peerRef,
        stream,
        videoRef,
        screenStreamRef,
        setIsScreenOn,
      });

      peerRef.current?.destroy();
      peerRef.current = undefined;

      socket.current?.disconnect();
      socket.current = io(`${process.env.NEXT_PUBLIC_API_URL}`);

      setReconnect(!reConnect);
    });
  }, [
    peerRef,
    peerVideoRef,
    reConnect,
    screenStreamRef,
    setIsPeerScreenOn,
    setIsPeerVideoOn,
    setIsReady,
    setIsScreenOn,
    setPeerStream,
    setReconnect,
    socket,
    stream,
    videoRef,
  ]);

  //*- 정보 송신
  useEffect(() => {
    socket.current?.emit("peerVideo", { debateId, isVideoOn });
  }, [debateId, isVideoOn, peerRef, socket, peerStream]); // dependency로 peerStream 필요

  useEffect(() => {
    socket.current?.emit("peerScreen", { debateId, isScreenOn });
  }, [debateId, isScreenOn, socket]);

  useEffect(() => {
    socket.current?.emit("ready", { debateId, isReady, isPros });
  }, [debateId, isPros, isReady, socket]);
};

export const wsTransmitSkip = ({
  debateId,
  socket,
  isPros,
}: Pick<IDebateroom, "debateId" | "socket" | "isPros">) => {
  socket.current?.emit("skip", { debateId, isPros });
};
