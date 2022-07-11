import { Dispatch, MutableRefObject, SetStateAction } from "react";
import { Socket } from "socket.io-client";
import Peer from "simple-peer";

export interface IDebateroom {
  debateId: string | string[] | undefined;
  socket: MutableRefObject<Socket | undefined>;
  isPros: boolean; //! 임시 타입
  //* WebRTC 타입
  reConnect: boolean;
  setReconnect: (params: boolean) => void;
  peerRef: MutableRefObject<Peer.Instance | undefined>;
  //* 캔버스 타입
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  //* 스트림 타입
  stream: MediaStream | undefined;
  setStream: (params: MediaStream | undefined) => void;
  peerStream: MediaStream | undefined;
  setPeerStream: (params: MediaStream | undefined) => void;
  videoRef: MutableRefObject<HTMLVideoElement | null>;
  peerVideoRef: MutableRefObject<HTMLVideoElement | null>;
  screenStreamRef: MutableRefObject<MediaStream | undefined>;
  //* 토글 타입
  isMicOn: boolean;
  setIsMicOn: (params: boolean) => void;
  isVideoOn: boolean;
  setIsVideoOn: (params: boolean) => void;
  isPeerVideoOn: boolean;
  setIsPeerVideoOn: (params: boolean) => void;
  isScreenOn: boolean;
  setIsScreenOn: (params: boolean) => void;
  isPeerScreenOn: boolean;
  setIsPeerScreenOn: (params: boolean) => void;
  isReady: boolean;
  setIsReady: (params: boolean) => void;
  //* 토론 타입
  isStart: boolean;
  setIsStart: (params: boolean) => void;
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
  mergedBlobRef: MutableRefObject<Blob | undefined>;

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
