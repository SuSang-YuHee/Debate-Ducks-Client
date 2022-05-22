import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import Peer from "simple-peer";

import { connectHostPeer, connectGuestPeer } from "./utils/simple-peer";

import Buttons from "./Buttons";

interface IRoomProps {
  debateId: string | string[] | undefined;
  socket: Socket | undefined;
}

export default function Room({ debateId, socket }: IRoomProps) {
  const peerRef = useRef<Peer.Instance>();
  const myStreamRef = useRef<MediaStream>();
  const peerStreamRef = useRef<MediaStream>();
  const myVideoRef = useRef<HTMLVideoElement>(null);
  const peerVideoRef = useRef<HTMLVideoElement>(null);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(false);

  useEffect(() => {
    if (debateId && socket) {
      navigator.mediaDevices
        .getUserMedia({
          video: { facingMode: "user" },
          audio: { echoCancellation: true, noiseSuppression: true },
        })
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
          peerRef,
          myStreamRef,
          peerStreamRef,
          peerVideoRef,
        );
      });

      socket.on("offer", (signal: Peer.SignalData) => {
        connectGuestPeer(
          debateId,
          socket,
          peerRef,
          myStreamRef,
          peerStreamRef,
          peerVideoRef,
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
      <Buttons
        myStreamRef={myStreamRef}
        isAudioMuted={isAudioMuted}
        setIsAudioMuted={setIsAudioMuted}
        isVideoMuted={isVideoMuted}
        setIsVideoMuted={setIsVideoMuted}
      />
    </div>
  );
}
