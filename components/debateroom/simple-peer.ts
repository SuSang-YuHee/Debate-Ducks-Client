import { Socket } from "socket.io-client";
import Peer from "simple-peer";

export const connectHostPeer = (
  debateId: string | string[],
  socket: Socket,
  peer: Peer.Instance | undefined,
  myStream: MediaStream | undefined,
  peerStream: MediaStream | undefined,
  peerVideo: HTMLVideoElement | null,
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
    stream: myStream,
  });

  peer = simplePeer;

  simplePeer.on("signal", (signal) => {
    socket.emit("offer", { debateId, signal });
  });

  simplePeer.on("stream", (stream) => {
    peerStream = stream;
    if (peerVideo) {
      peerVideo.srcObject = stream;
    }
  });

  simplePeer.on("error", (err) => {
    console.log("error", err); //*
  });

  socket.on("answer", (signal: Peer.SignalData) => {
    simplePeer.signal(signal);
  });
};

export const connectGuestPeer = (
  debateId: string | string[],
  socket: Socket,
  peer: Peer.Instance | undefined,
  myStream: MediaStream | undefined,
  peerStream: MediaStream | undefined,
  peerVideo: HTMLVideoElement | null,
  signal: Peer.SignalData,
) => {
  const simplePeer = new Peer({
    initiator: false,
    trickle: false,
    stream: myStream,
  });

  peer = simplePeer;

  simplePeer.on("signal", (signal) => {
    socket.emit("answer", { debateId, signal });
  });

  simplePeer.on("stream", (stream) => {
    peerStream = stream;
    if (peerVideo) {
      peerVideo.srcObject = stream;
    }
  });

  simplePeer.on("error", (err) => {
    console.log("error", err); //*
  });

  simplePeer.signal(signal);
};
