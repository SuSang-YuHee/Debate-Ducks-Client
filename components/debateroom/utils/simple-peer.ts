import { MutableRefObject } from "react";
import { Socket } from "socket.io-client";
import Peer from "simple-peer";

export const connectHostPeer = (
  debateId: string | string[],
  socket: MutableRefObject<Socket | undefined>,
  peerRef: MutableRefObject<Peer.Instance | undefined>,
  stream: MediaStream | undefined,
  setPeerStream: (params: MediaStream | undefined) => void,
  peerVideoRef: MutableRefObject<HTMLVideoElement | null>,
) => {
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
    stream,
  });

  peerRef.current = simplePeer;

  simplePeer.on("signal", (signal) => {
    socket.current?.emit("offer", { debateId, signal });
  });

  simplePeer.on("stream", (stream) => {
    setPeerStream(stream);
    if (peerVideoRef.current) {
      peerVideoRef.current.srcObject = stream;
    }
  });

  simplePeer.on("error", (err) => {
    console.log(err);
  });

  socket.current?.on("answer", (signal: Peer.SignalData) => {
    simplePeer.signal(signal);
  });
};

export const connectGuestPeer = (
  debateId: string | string[],
  socket: MutableRefObject<Socket | undefined>,
  peerRef: MutableRefObject<Peer.Instance | undefined>,
  stream: MediaStream | undefined,
  setPeerStream: (params: MediaStream | undefined) => void,
  peerVideoRef: MutableRefObject<HTMLVideoElement | null>,
  signal: Peer.SignalData,
) => {
  const simplePeer = new Peer({
    initiator: false,
    trickle: false,
    stream,
  });

  peerRef.current = simplePeer;

  simplePeer.on("signal", (signal) => {
    socket.current?.emit("answer", { debateId, signal });
  });

  simplePeer.on("stream", (stream) => {
    setPeerStream(stream);
    if (peerVideoRef.current) {
      peerVideoRef.current.srcObject = stream;
    }
  });

  simplePeer.on("error", (err) => {
    console.log(err);
  });

  simplePeer.signal(signal);
};
