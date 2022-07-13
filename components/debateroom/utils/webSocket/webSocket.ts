import { useEffect } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

import { drawNotice } from "../draw";
import { beep } from "../beep";
import { offScreenShare } from "../screenShare";
import { connectHostPeer, connectGuestPeer } from "./simple-peer";

import { IDebateroom, IDebateData } from "../../types";

export const useWebSocket = ({
  debateId,
  socket,
  isPros,
  reconnect,
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
  setIsPause,
  pauseRef,
  setTurn,
  recorderRef,
  blobsRef,
  dummy,
  testARef,
}: Pick<
  IDebateroom,
  | "debateId"
  | "socket"
  | "isPros"
  | "reconnect"
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
  | "setIsPause"
  | "pauseRef"
  | "setTurn"
  | "recorderRef"
  | "blobsRef"
  | "dummy"
  | "testARef"
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
        if (videoRef.current) videoRef.current.srcObject = stream;

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
            blobsRef,
          });
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
              blobsRef,
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

    //* 토론
    socket.current?.on("debateStart", () => {
      setIsStart(true);
    });

    socket.current?.on("debatePause", (isPause: boolean) => {
      setIsPause(isPause);

      if (isPause) {
        pauseRef.current.time = 30;
        pauseRef.current.timer = setInterval(() => {
          drawNotice(
            { canvasRef, turn: "none" },
            {
              notice:
                pauseRef.current.time > 0
                  ? "상대 토론자를 기다리는 중입니다."
                  : "토론이 종료 되었습니다.",
              turn: -1,
              timer: pauseRef.current.time,
            },
            dummy.topic,
          );
          pauseRef.current.time -= 1;

          if (pauseRef.current.time >= 0) return;
          socket.current?.emit("debateDone", { debateId, winner: isPros });

          if (!pauseRef.current.timer) return;
          clearInterval(pauseRef.current.timer);
          pauseRef.current.timer = null;
          pauseRef.current.time = -1;
        }, 1000);
      } else {
        if (!pauseRef.current.timer) return;
        clearInterval(pauseRef.current.timer);
        pauseRef.current.timer = null;
        pauseRef.current.time = -1;
      }
    });

    //* 최초 공지
    drawNotice(
      { canvasRef, turn: "none" },
      {
        notice: dummy.topic,
        turn: -1,
        timer: -1,
      },
      dummy.topic,
    );

    //* 토론 진행 및 공지
    socket.current?.on("debate", (debateData: IDebateData) => {
      let turn:
        | "none"
        | "notice"
        | "pros"
        | "cons"
        | "prosCross"
        | "consCross" = "notice";
      if (debateData.turn === 7 && debateData.timer < 0) {
        socket.current?.emit("debateDone", { debateId, winner: null });
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

    //* 토론 종료
    socket.current?.on("debateDone", async (isRecorder: boolean) => {
      if (recorderRef.current?.state === "recording") {
        recorderRef.current?.stop();
      }

      const mergedBlob = await new Blob(blobsRef.current, {
        type: "video/webm",
      });
      const url = window.URL.createObjectURL(mergedBlob);
      if (testARef.current) testARef.current.href = url;

      if (!isRecorder) return;
      //! 동영상 올리는 로직
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
    reconnect,
    recorderRef,
    blobsRef,
    testARef,
    setIsPause,
    pauseRef,
    isPros,
  ]); // dependency에 reconnect 필요

  //*- 연결 해제
  useEffect(() => {
    socket.current?.on("peerDisconnect", () => {
      if (peerVideoRef.current) peerVideoRef.current.srcObject = null;
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

      setReconnect((state) => !state);
    });
  }, [
    peerRef,
    peerVideoRef,
    recorderRef,
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
  }, [debateId, isVideoOn, peerRef, socket, peerStream]); // dependency에 peerStream 필요

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
