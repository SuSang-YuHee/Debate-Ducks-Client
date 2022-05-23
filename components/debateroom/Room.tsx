import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";
import Peer from "simple-peer";

import { connectHostPeer, connectGuestPeer } from "./simple-peer";

interface IRoomProps {
  debateId: string | string[] | undefined;
  socket: Socket | undefined;
}

export default function Room({ debateId, socket }: IRoomProps) {
  const myStreamRef = useRef<MediaStream>();
  const peerStreamRef = useRef<MediaStream>();
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const peerVideoRef = useRef<HTMLVideoElement>(null);
  const peerRef = useRef<Peer.Instance>();

  useEffect(() => {
    if (debateId && socket) {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: "user" }, audio: true })
        .then((stream) => {
          myStreamRef.current = stream;
          if (myVideoRef.current) {
            myVideoRef.current.srcObject = stream;
          }
        });

      socket.emit("join", { debateId });

      socket.on("overcapacity", () => {
        console.log("overcapacity"); //*
        socket.disconnect(); //*
      });

      socket.on("guestJoin", () => {
        connectHostPeer(
          debateId,
          socket,
          peerRef.current,
          myStreamRef.current,
          peerStreamRef.current,
          peerVideoRef.current,
        );
      });

      socket.on("offer", (signal: Peer.SignalData) => {
        connectGuestPeer(
          debateId,
          socket,
          peerRef.current,
          myStreamRef.current,
          peerStreamRef.current,
          peerVideoRef.current,
          signal,
        );
      });
    }
  }, [debateId, socket]);

  return (
    <div>
      <h1>Room</h1>
      <video ref={myVideoRef} muted autoPlay playsInline></video>
      <video ref={peerVideoRef} autoPlay playsInline></video>
    </div>
  );
}
