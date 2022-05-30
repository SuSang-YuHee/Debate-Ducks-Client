import { MutableRefObject } from "react";
import { Socket } from "socket.io-client";
import Peer from "simple-peer";

export interface IDebateroomProps {
  debateId: string | string[] | undefined;
  socket: MutableRefObject<Socket | undefined>;
  //*- WebRTC 타입
  reConnect: boolean;
  setReconnect: (reConnect: boolean) => void;
  peer: Peer.Instance | undefined;
  setPeer: (peer: Peer.Instance | undefined) => void;
  //*- 캔버스 타입
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  //*- 녹화 타입
  recorderRef: MutableRefObject<MediaRecorder | undefined>;
  downRef: MutableRefObject<HTMLAnchorElement | null>;
  //*- 스트림 타입
  streamRef: MutableRefObject<MediaStream | undefined>;
  peerStreamRef: MutableRefObject<MediaStream | undefined>;
  videoRef: MutableRefObject<HTMLVideoElement | null>;
  peerVideoRef: MutableRefObject<HTMLVideoElement | null>;
  screenStreamRef: MutableRefObject<MediaStream | undefined>;
  isAudioOn: boolean;
  setIsAudioOn: (isAudioOn: boolean) => void;
  isVideoOn: boolean;
  setIsVideoOn: (isVideoOn: boolean) => void;
  isPeerVideoOn: boolean;
  setIsPeerVideoOn: (isVideoOn: boolean) => void;
  isScreenOn: boolean;
  setIsScreenOn: (isScreenON: boolean) => void;
  isPeerScreenOn: boolean;
  setIsPeerScreenOn: (isScreenON: boolean) => void;
  //*- 토론 타입
  isReady: boolean;
  setIsReady: (isReady: boolean) => void;
  isStart: boolean;
  setIsStart: (isStart: boolean) => void;
  turn: "notice" | "pros" | "cons" | "prosCross" | "consCross";
  setIsTurn: (
    turn: "notice" | "pros" | "cons" | "prosCross" | "consCross",
  ) => void;
  //! 임시 타입
  dummy: IDummy;
  isPros: boolean;
}

//! 임시 타입
export interface IDummy {
  topic: string;
  prosName: string;
  consName: string;
}
