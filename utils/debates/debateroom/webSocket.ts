import axios from "axios";
import toast from "react-hot-toast";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";
import { useRouter } from "next/router";

import { drawNotice } from "./draw";
import { beep } from "./beep";
import { offScreenShare } from "./screenShare";
import { connectHostPeer, connectGuestPeer } from "./simple-peer";
import uploadVideo from "./aws";

import { IDebateroom, IDebateData, TTurn } from "../../../types";

export const useWebSocket = ({
  debateId,
  socketRef,
  debate,
  isPros,
  setIsDoneModalOn,
  setIsUploadModalOn,
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
  setIsSkipTime,
  mergedAudioRef,
  recorderRef,
  blobRef,
}: Pick<
  IDebateroom,
  | "debateId"
  | "socketRef"
  | "debate"
  | "isPros"
  | "setIsDoneModalOn"
  | "setIsUploadModalOn"
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
  | "setIsSkipTime"
  | "mergedAudioRef"
  | "recorderRef"
  | "blobRef"
>) => {
  const router = useRouter();
  const [reConnect, setReConnect] = useState<boolean>(false);

  //# 연결
  useEffect(() => {
    //> 미디어 획득 및 연결
    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: "user", width: 500, height: 500 },
        audio: { echoCancellation: true, noiseSuppression: true },
      })
      .then((stream) => {
        streamRef.current?.getTracks().forEach((track) => {
          track.stop();
        });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        socketRef.current.emit("join", { debateId });

        socketRef.current.on("overcapacity", () => {
          toast.error("정원 초과입니다.");
          streamRef.current?.getTracks().forEach((track) => {
            track.stop();
          });
          peerRef.current?.destroy();
          socketRef.current.disconnect();
          router.push(`/debate?debateId=${debateId}`);
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

    //> 정보 수신
    socketRef.current.on("peerVideo", (isPeerVideoOn: boolean) => {
      setIsPeerVideoOn(isPeerVideoOn);
    });

    socketRef.current.on("peerScreen", (isPeerScreenOn: boolean) => {
      setIsPeerScreenOn(isPeerScreenOn);
    });

    socketRef.current.on("debateStart", () => {
      setIsStart(true);
    });

    //> 최초 공지
    drawNotice(
      { canvasRef, turn: "none" },
      {
        notice: debate.title,
        turn: 7,
        time: 0,
      },
      debate.title,
    );

    //> 토론 및 공지
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
        if (debateData.time > 1 && debateData.time < 120) {
          setIsSkipTime(true);
        } else {
          setIsSkipTime(false);
        }
        drawNotice({ canvasRef, turn }, debateData, debate.title);
        if (debateData.time === 10 || debateData.time === 1) beep();
      }
    });

    //> 토론 종료
    socketRef.current.on("debateDone", (isUploader: boolean) => {
      if (isUploader) {
        setIsUploadModalOn(true);
        uploadVideo(blobRef.current, `${debateId}`)
          .then((url: string | null) => {
            axios.patch(
              `${process.env.NEXT_PUBLIC_API_URL}/debates`,
              {
                id: parseInt(debateId),
                video_url: url,
              },
              {
                withCredentials: true,
              },
            );
            setIsUploadModalOn(false);
            setIsDoneModalOn(true);
          })
          .catch(() => {
            setIsUploadModalOn(false);
            setIsDoneModalOn(true);
          });
      } else {
        setIsDoneModalOn(true);
      }
    });
  }, [
    canvasRef,
    debate.title,
    debateId,
    isDoneRef,
    peerRef,
    peerVideoRef,
    recorderRef,
    router,
    setIsDoneModalOn,
    setIsPeerScreenOn,
    setIsPeerVideoOn,
    setIsStart,
    setPeerStream,
    setTurn,
    socketRef,
    streamRef,
    setIsSkipTime,
    videoRef,
    reConnect,
    setIsUploadModalOn,
    blobRef,
  ]); // dependency에 reConnect 필요

  //# 연결 해제
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
      setIsSkipTime(false);
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
    setIsSkipTime,
    videoRef,
  ]);

  //# 정보 송신
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

//# 넘기기 정보 송신
export const wsTransmitSkip = ({
  debateId,
  socketRef,
  isPros,
}: Pick<IDebateroom, "debateId" | "socketRef" | "isPros">) => {
  socketRef.current.emit("skip", { debateId, isPros });
};
