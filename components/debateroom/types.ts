import { Dispatch, MutableRefObject, SetStateAction } from "react";
import { Socket } from "socket.io-client";
import Peer from "simple-peer";

export interface IDebateroomProps {
  debateId: string | string[] | undefined;
  socket: MutableRefObject<Socket | undefined>;
  //*- WebRTC 타입
  reConnect: boolean;
  setReconnect: (params: boolean) => void;
  peerRef: MutableRefObject<Peer.Instance | undefined>;
  //*- 캔버스 타입
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  //*- 스트림 타입
  stream: MediaStream | undefined;
  setStream: (params: MediaStream | undefined) => void;
  peerStream: MediaStream | undefined;
  setPeerStream: (params: MediaStream | undefined) => void;
  videoRef: MutableRefObject<HTMLVideoElement | null>;
  peerVideoRef: MutableRefObject<HTMLVideoElement | null>;
  screenStreamRef: MutableRefObject<MediaStream | undefined>;
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
  //*- 토론 타입
  isReady: boolean;
  setIsReady: (params: boolean) => void;
  isStart: boolean;
  setIsStart: (params: boolean) => void;
  turn: "none" | "notice" | "pros" | "cons" | "prosCross" | "consCross";
  setIsTurn: Dispatch<
    SetStateAction<
      "none" | "notice" | "pros" | "cons" | "prosCross" | "consCross"
    >
  >;
  //*- 녹화 타입
  isRecorder: boolean;
  setIsRecorder: (params: boolean) => void;
  mergedAudioTracks: MediaStreamTrack[];
  setMergedAudioTracks: (params: MediaStreamTrack[]) => void;
  recorderRef: MutableRefObject<MediaRecorder | undefined>;

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
