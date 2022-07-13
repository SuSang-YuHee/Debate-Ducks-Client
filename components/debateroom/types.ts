import { Dispatch, MutableRefObject, SetStateAction } from "react";
import { Socket } from "socket.io-client";
import Peer from "simple-peer";

export interface IDebateroom {
  debateId: string | string[] | undefined;
  socket: MutableRefObject<Socket | undefined>;
  isPros: boolean; //! 임시 타입
  //* WebRTC 타입
  reconnect: boolean;
  setReconnect: Dispatch<SetStateAction<boolean>>;
  peerRef: MutableRefObject<Peer.Instance | undefined>;
  //* 캔버스 타입
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  //* 스트림 타입
  stream: MediaStream | undefined;
  setStream: Dispatch<SetStateAction<MediaStream | undefined>>;
  peerStream: MediaStream | undefined;
  setPeerStream: Dispatch<SetStateAction<MediaStream | undefined>>;
  videoRef: MutableRefObject<HTMLVideoElement | null>;
  peerVideoRef: MutableRefObject<HTMLVideoElement | null>;
  screenStreamRef: MutableRefObject<MediaStream | undefined>;
  //* 토글 타입
  isMicOn: boolean;
  setIsMicOn: Dispatch<SetStateAction<boolean>>;
  isVideoOn: boolean;
  setIsVideoOn: Dispatch<SetStateAction<boolean>>;
  isPeerVideoOn: boolean;
  setIsPeerVideoOn: Dispatch<SetStateAction<boolean>>;
  isScreenOn: boolean;
  setIsScreenOn: Dispatch<SetStateAction<boolean>>;
  isPeerScreenOn: boolean;
  setIsPeerScreenOn: Dispatch<SetStateAction<boolean>>;
  isReady: boolean;
  setIsReady: Dispatch<SetStateAction<boolean>>;
  //* 토론 타입
  isStart: boolean;
  setIsStart: Dispatch<SetStateAction<boolean>>;
  isPause: boolean;
  setIsPause: Dispatch<SetStateAction<boolean>>;
  pauseRef: MutableRefObject<{ timer: NodeJS.Timer | null; time: number }>;
  turn: "none" | "notice" | "pros" | "cons" | "prosCross" | "consCross";
  setTurn: Dispatch<
    SetStateAction<
      "none" | "notice" | "pros" | "cons" | "prosCross" | "consCross"
    >
  >;
  //* 녹화 타입
  mergedAudio: MediaStreamTrack[] | undefined;
  setMergedAudio: Dispatch<SetStateAction<MediaStreamTrack[] | undefined>>;
  recorderRef: MutableRefObject<MediaRecorder | undefined>;
  reRecord: boolean;
  setReRecord: Dispatch<SetStateAction<boolean>>;
  blobsRef: MutableRefObject<Blob[]>;

  //! 임시 타입
  dummy: IDummy;
  testARef: MutableRefObject<HTMLAnchorElement | null>;
}

export interface IDebateData {
  notice: string;
  turn: number;
  timer: number;
}

export interface IDummy {
  topic: string;
  prosName: string;
  consName: string;
}
