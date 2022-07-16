import { Dispatch, MutableRefObject, SetStateAction } from "react";
import { Socket } from "socket.io-client";
import Peer from "simple-peer";

export interface IDebateroom {
  debateId: string | string[] | undefined;
  socket: MutableRefObject<Socket | undefined>;
  isPros: boolean; //! 임시
  //* WebRTC 타입
  peerRef: MutableRefObject<Peer.Instance | undefined>;
  isHostRef: MutableRefObject<boolean>;
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
  isDoneRef: MutableRefObject<boolean>;
  turn: TTurn;
  setTurn: Dispatch<SetStateAction<TTurn>>;
  timeRef: MutableRefObject<number>;
  //* 녹화 타입
  mergedAudioRef: MutableRefObject<MediaStreamTrack[] | undefined>;
  recorderRef: MutableRefObject<MediaRecorder | undefined>;
  blobsRef: MutableRefObject<Blob[]>;
  blobRef: MutableRefObject<Blob | undefined>;

  //! 임시
  dummy: IDummy;
  testARef: MutableRefObject<HTMLAnchorElement | null>;
}

export type TTurn =
  | "none"
  | "notice"
  | "pros"
  | "cons"
  | "prosCross"
  | "consCross";

export interface IDebateData {
  notice: string;
  turn: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  time: number;
}

export interface IDummy {
  topic: string;
  prosName: string;
  consName: string;
}
