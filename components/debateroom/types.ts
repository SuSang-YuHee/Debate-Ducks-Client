import { MutableRefObject } from "react";
import { Socket } from "socket.io-client";
import Peer from "simple-peer";

export interface IDebateroomProps {
  debateId: string | string[] | undefined;
  socket: Socket | undefined;
  reConnect: boolean;
  setReconnect: (reConnect: boolean) => void;
  peer: Peer.Instance | undefined;
  recorderRef: MutableRefObject<MediaRecorder | undefined>;
  downRef: MutableRefObject<HTMLAnchorElement | null>;
  setPeer: (peer: Peer.Instance | undefined) => void;
  streamRef: MutableRefObject<MediaStream | undefined>;
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
  isStart: boolean;
  //! 임시 타입
  dummy: IDummy;
  isPros: boolean;
}

//! 임시 타입
export interface IDummy {
  topic: string;
  prosName: string;
  consName: string;
  prosTurn: string;
}
