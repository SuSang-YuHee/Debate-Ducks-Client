import { MutableRefObject } from "react";
import { Socket } from "socket.io-client";
import Peer from "simple-peer";

export interface IDebateroomProps {
  debateId: string | string[] | undefined;
  socket: Socket | undefined;
  peerRef: MutableRefObject<Peer.Instance | undefined>;
  streamRef: MutableRefObject<MediaStream | undefined>;
  videoRef: MutableRefObject<HTMLVideoElement | null>;
  peerVideoRef: MutableRefObject<HTMLVideoElement | null>;
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
  recorderRef: MutableRefObject<MediaRecorder | undefined>;
  downRef: MutableRefObject<HTMLAnchorElement | null>;
  dummy: IDummy;
}

//! 임시 타입
export interface IDummy {
  topic: string;
  isPros: boolean;
  isProsTurn: boolean;
  prosName: string;
  consName: string;
}