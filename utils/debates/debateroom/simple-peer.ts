import toast from "react-hot-toast";
import Peer from "simple-peer";

import { IDebateroom } from "../../../types";

export const connectHostPeer = ({
  debateId,
  socketRef,
  peerRef,
  streamRef,
  setPeerStream,
  peerVideoRef,
}: Pick<
  IDebateroom,
  | "debateId"
  | "socketRef"
  | "peerRef"
  | "streamRef"
  | "setPeerStream"
  | "peerVideoRef"
>) => {
  const simplePeer = new Peer({
    initiator: true,
    trickle: false,
    config: {
      iceServers: [
        { urls: "stun:stun.l.google.com:19302" },
        { urls: "stun:stun1.l.google.com:19302" },
        { urls: "stun:stun2.l.google.com:19302" },
        { urls: "stun:stun3.l.google.com:19302" },
        { urls: "stun:stun4.l.google.com:19302" },
        { urls: "stun:stun.nextcloud.com:443" },
      ],
    },
    stream: streamRef.current,
  });

  peerRef.current = simplePeer;

  simplePeer.on("signal", (signal) => {
    socketRef.current.emit("offer", { debateId, signal });
  });

  simplePeer.on("stream", (stream) => {
    setPeerStream(stream);
    if (peerVideoRef.current) {
      peerVideoRef.current.srcObject = stream;
    }
  });

  simplePeer.on("error", (err) => {
    toast.error(err.message);
  });

  socketRef.current.on("answer", (signal: Peer.SignalData) => {
    simplePeer.signal(signal);
  });
};

export const connectGuestPeer = (
  {
    debateId,
    socketRef,
    peerRef,
    streamRef,
    setPeerStream,
    peerVideoRef,
  }: Pick<
    IDebateroom,
    | "debateId"
    | "socketRef"
    | "peerRef"
    | "streamRef"
    | "setPeerStream"
    | "peerVideoRef"
  >,
  signal: Peer.SignalData,
) => {
  const simplePeer = new Peer({
    initiator: false,
    trickle: false,
    stream: streamRef.current,
  });

  peerRef.current = simplePeer;

  simplePeer.on("signal", (signal) => {
    socketRef.current.emit("answer", { debateId, signal });
  });

  simplePeer.on("stream", (stream) => {
    setPeerStream(stream);
    if (peerVideoRef.current) {
      peerVideoRef.current.srcObject = stream;
    }
  });

  simplePeer.on("error", (err) => {
    toast.error(err.message);
  });

  simplePeer.signal(signal);
};
