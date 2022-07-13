import Peer from "simple-peer";

import { IDebateroom } from "../../types";

export const connectHostPeer = ({
  debateId,
  socket,
  peerRef,
  stream,
  setPeerStream,
  peerVideoRef,
  blobsRef,
}: Pick<
  IDebateroom,
  | "debateId"
  | "socket"
  | "peerRef"
  | "stream"
  | "setPeerStream"
  | "peerVideoRef"
  | "blobsRef"
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

  //! 개발중
  simplePeer.on("connect", () => {
    console.log("connect"); //!
    const blobs = blobsRef.current;
    blobs.reverse().forEach((blob) => {
      new Response(blob).arrayBuffer().then((arrayBuffer) => {
        peerRef.current?.send(arrayBuffer);
      });
    });
  });

  simplePeer.on("error", (err) => {
    console.log(err);
  });

  socket.current?.on("answer", (signal: Peer.SignalData) => {
    simplePeer.signal(signal);
  });
};

export const connectGuestPeer = (
  {
    debateId,
    socket,
    peerRef,
    stream,
    setPeerStream,
    peerVideoRef,
    blobsRef,
  }: Pick<
    IDebateroom,
    | "debateId"
    | "socket"
    | "peerRef"
    | "stream"
    | "setPeerStream"
    | "peerVideoRef"
    | "blobsRef"
  >,
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

  //! 개발중
  simplePeer.on("data", (arrayBuffer) => {
    const blob = new Blob([new Uint8Array(arrayBuffer)], {
      type: "video/x-matroska;codecs=avc1,opus",
    });
    blobsRef.current.unshift(blob);
  });

  simplePeer.on("error", (err) => {
    console.log(err);
  });

  simplePeer.signal(signal);
};
