import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

import { drawNotice } from "./draw";
import { beep } from "./beep";
import { offScreenShare } from "./screenShare";
import { connectHostPeer, connectGuestPeer } from "./simple-peer";

import { IDebateroom, IDebateData, TTurn } from "../types";

export const useWebSocket = ({
  debateId,
  socket,
  isPros,
  peerRef,
  isHostRef,
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
  isDoneRef,
  setTurn,
  timeRef,
  mergedAudioRef,
  recorderRef,
  blobsRef,
  dummy,
}: Pick<
  IDebateroom,
  | "debateId"
  | "socket"
  | "isPros"
  | "peerRef"
  | "isHostRef"
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
  | "isDoneRef"
  | "setTurn"
  | "timeRef"
  | "mergedAudioRef"
  | "recorderRef"
  | "blobsRef"
  | "dummy"
>) => {
  const [reconnect, setReconnect] = useState<boolean>(false);

  //*- 연결
  useEffect(() => {
    if (!debateId) return;

    //* 미디어 획득 및 연결
    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: "user", width: 500, height: 500 },
        audio: { echoCancellation: true, noiseSuppression: true },
      })
      .then((stream) => {
        setStream(stream);
        if (videoRef.current) videoRef.current.srcObject = stream;
        socket.current?.emit("join", { debateId });

        socket.current?.on("overcapacity", () => {
          //Todo: 입장 초과 모달
          console.log("overcapacity");
        });

        socket.current?.on("peerJoin", () => {
          connectHostPeer({
            debateId,
            socket,
            peerRef,
            stream,
            setPeerStream,
            peerVideoRef,
          });
          isHostRef.current = true;
        });

        socket.current?.on("offer", (signal: Peer.SignalData) => {
          connectGuestPeer(
            {
              debateId,
              socket,
              peerRef,
              stream,
              setPeerStream,
              peerVideoRef,
            },
            signal,
          );
        });
      });

    //* 정보 수신
    socket.current?.on("peerVideo", (isPeerVideoOn: boolean) => {
      setIsPeerVideoOn(isPeerVideoOn);
    });

    socket.current?.on("peerScreen", (isPeerScreenOn: boolean) => {
      setIsPeerScreenOn(isPeerScreenOn);
    });

    socket.current?.on("debateStart", () => {
      setIsStart(true);
    });

    //* 최초 공지
    drawNotice(
      { canvasRef, turn: "none" },
      {
        notice: dummy.topic,
        turn: 7,
        time: 0,
      },
      dummy.topic,
    );

    //* 토론 및 공지
    socket.current?.on("debate", (debateData: IDebateData) => {
      let turn: TTurn = "notice";
      if (debateData.turn === 7 && debateData.time < 0) {
        isDoneRef.current = true;
        if (recorderRef.current?.state === "recording") {
          recorderRef.current?.stop();
        }
      } else {
        if (debateData.turn === 1 || debateData.turn === 5) turn = "pros";
        if (debateData.turn === 3 || debateData.turn === 6) turn = "cons";
        if (debateData.turn === 4) turn = "prosCross";
        if (debateData.turn === 2) turn = "consCross";
        setTurn(turn);
        timeRef.current = debateData.time;
        drawNotice({ canvasRef, turn }, debateData, dummy.topic);
        if (debateData.time === 10 || debateData.time === 1) beep();
      }
    });

    socket.current?.on("debateDone", () => {
      //Todo: 토론 종료 모달
      console.log("토론 종료 모달");
    });
  }, [
    canvasRef,
    debateId,
    dummy.topic,
    isDoneRef,
    isHostRef,
    peerRef,
    peerVideoRef,
    reconnect,
    recorderRef,
    setIsPeerScreenOn,
    setIsPeerVideoOn,
    setIsStart,
    setPeerStream,
    setStream,
    setTurn,
    socket,
    timeRef,
    videoRef,
  ]); // dependency에 reconnect 필요

  //*- 연결 해제
  useEffect(() => {
    socket.current?.on("peerDisconnect", () => {
      if (recorderRef.current?.state === "recording") {
        recorderRef.current?.stop();
      }

      offScreenShare({
        peerRef,
        stream,
        videoRef,
        screenStreamRef,
        setIsScreenOn,
      });

      setPeerStream(undefined);
      if (peerVideoRef.current) peerVideoRef.current.srcObject = null;
      setIsPeerVideoOn(false);
      setIsPeerScreenOn(false);
      setIsReady(false);
      setIsStart(false);
      setTurn("none");
      timeRef.current = 0;
      mergedAudioRef.current = undefined;
      recorderRef.current = undefined;

      peerRef.current?.destroy();
      peerRef.current = undefined;

      socket.current?.disconnect();
      socket.current = io(`${process.env.NEXT_PUBLIC_API_URL}`);

      setReconnect((state) => !state);
    });
  }, [
    blobsRef,
    mergedAudioRef,
    peerRef,
    peerVideoRef,
    recorderRef,
    screenStreamRef,
    setIsPeerScreenOn,
    setIsPeerVideoOn,
    setIsReady,
    setIsScreenOn,
    setIsStart,
    setPeerStream,
    setTurn,
    socket,
    stream,
    timeRef,
    videoRef,
  ]);

  //*- 정보 송신
  useEffect(() => {
    socket.current?.emit("peerVideo", { debateId, isVideoOn });
  }, [debateId, isVideoOn, peerStream, socket]); // dependency에 peerStream 필요

  useEffect(() => {
    socket.current?.emit("peerScreen", { debateId, isScreenOn });
  }, [debateId, isScreenOn, socket]);

  useEffect(() => {
    socket.current?.emit("ready", { debateId, isReady, isPros });
  }, [debateId, isReady, socket, isPros]);
};

export const wsTransmitSkip = ({
  debateId,
  socket,
  isPros,
  timeRef,
}: Pick<IDebateroom, "debateId" | "socket" | "isPros" | "timeRef">) => {
  socket.current?.emit("skip", { debateId, isPros }); //!
  if (timeRef.current < 60 && timeRef.current > 1) {
    socket.current?.emit("skip", { debateId, isPros });
  } else {
    //Todo: 스킵 안내 모달
  }
};
