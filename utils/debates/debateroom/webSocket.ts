import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

import { drawNotice } from "./draw";
import { beep } from "./beep";
import { offScreenShare } from "./screenShare";
import { connectHostPeer, connectGuestPeer } from "./simple-peer";

import { IDebateroom, IDebateData, TTurn } from "../../../types";
import toast from "react-hot-toast";

export const useWebSocket = ({
  debateId,
  socketRef,
  debate,
  isPros,
  peerRef,
  canvasRef,
  streamRef,
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
}: Pick<
  IDebateroom,
  | "debateId"
  | "socketRef"
  | "debate"
  | "isPros"
  | "peerRef"
  | "canvasRef"
  | "streamRef"
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
>) => {
  const [reConnect, setReConnect] = useState<boolean>(false);

  //*- 연결
  useEffect(() => {
    //* 미디어 획득 및 연결
    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: "user", width: 500, height: 500 },
        audio: { echoCancellation: true, noiseSuppression: true },
      })
      .then((stream) => {
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        socketRef.current.emit("join", { debateId });

        socketRef.current.on("overcapacity", () => {
          toast.error("정원 초과입니다.");
        });

        socketRef.current.on("peerJoin", () => {
          connectHostPeer({
            debateId,
            socketRef,
            peerRef,
            streamRef,
            setPeerStream,
            peerVideoRef,
          });
        });

        socketRef.current.on("offer", (signal: Peer.SignalData) => {
          connectGuestPeer(
            {
              debateId,
              socketRef,
              peerRef,
              streamRef,
              setPeerStream,
              peerVideoRef,
            },
            signal,
          );
        });
      });

    //* 정보 수신
    socketRef.current.on("peerVideo", (isPeerVideoOn: boolean) => {
      setIsPeerVideoOn(isPeerVideoOn);
    });

    socketRef.current.on("peerScreen", (isPeerScreenOn: boolean) => {
      setIsPeerScreenOn(isPeerScreenOn);
    });

    socketRef.current.on("debateStart", () => {
      setIsStart(true);
    });

    //* 최초 공지
    drawNotice(
      { canvasRef, turn: "none" },
      {
        notice: debate.title,
        turn: 7,
        time: 0,
      },
      debate.title,
    );

    //* 토론 및 공지
    socketRef.current.on("debate", (debateData: IDebateData) => {
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
        drawNotice({ canvasRef, turn }, debateData, debate.title);
        if (debateData.time === 10 || debateData.time === 1) beep();
      }
    });

    socketRef.current.on("debateDone", () => {
      //Todo: 토론 종료 모달
      console.log("토론 종료 모달");
    });
  }, [
    canvasRef,
    debate.title,
    debateId,
    isDoneRef,
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
    socketRef,
    streamRef,
    timeRef,
    videoRef,
    reConnect,
  ]); // dependency에 reConnect 필요

  useEffect(() => {
    socketRef.current.on("peerDisconnect", () => {
      if (recorderRef.current?.state === "recording") {
        recorderRef.current?.stop();
      }

      offScreenShare({
        peerRef,
        streamRef,
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

      socketRef.current.disconnect();
      socketRef.current = io(`${process.env.NEXT_PUBLIC_API_URL}`);
      setReConnect((state) => !state);
    });
  }, [
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
    socketRef,
    streamRef,
    timeRef,
    videoRef,
  ]);

  //*- 정보 송신
  useEffect(() => {
    socketRef.current.emit("peerVideo", { debateId, isVideoOn });
  }, [debateId, isVideoOn, peerStream, socketRef]); // dependency에 peerStream 필요

  useEffect(() => {
    socketRef.current.emit("peerScreen", { debateId, isScreenOn });
  }, [debateId, isScreenOn, socketRef]);

  useEffect(() => {
    socketRef.current.emit("ready", { debateId, isReady, isPros });
  }, [debateId, isReady, socketRef, isPros]);
};

export const wsTransmitSkip = ({
  debateId,
  socketRef,
  isPros,
  timeRef,
}: Pick<IDebateroom, "debateId" | "socketRef" | "isPros" | "timeRef">) => {
  socketRef.current.emit("skip", { debateId, isPros }); //!
  if (timeRef.current < 60 && timeRef.current > 1) {
    socketRef.current.emit("skip", { debateId, isPros });
  } else {
    toast.error("스킵은 1분 미만일 때만 할 수 있습니다.");
  }
};
