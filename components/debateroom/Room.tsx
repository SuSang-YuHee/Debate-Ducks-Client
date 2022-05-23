import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import Peer from "simple-peer";

import { connectHostPeer, connectGuestPeer } from "./utils/simple-peer";

import Canvas from "./Canvas";
import Buttons from "./Buttons";

interface IRoomProps {
  debateId: string | string[] | undefined;
  socket: Socket | undefined;
}

export default function Room({ debateId, socket }: IRoomProps) {
  const peerRef = useRef<Peer.Instance>();
  const streamRef = useRef<MediaStream>();
  const peerStreamRef = useRef<MediaStream>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerVideoRef = useRef<HTMLVideoElement>(null);
  const [isAudioMuted, setIsAudioMuted] = useState<boolean>(false);
  const [isVideoMuted, setIsVideoMuted] = useState<boolean>(false);
  const recorderRef = useRef<MediaRecorder>();
  const downRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    if (debateId && socket) {
      navigator.mediaDevices
        .getUserMedia({
          video: { facingMode: "user" },
          audio: { echoCancellation: true, noiseSuppression: true },
        })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
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
          streamRef,
          peerStreamRef,
          peerVideoRef,
        );
      });

      socket.on("offer", (signal: Peer.SignalData) => {
        connectGuestPeer(
          debateId,
          socket,
          peerRef,
          streamRef,
          peerStreamRef,
          peerVideoRef,
          signal,
        );
      });
    }
  }, [debateId, socket]);

  function downloadRecord() {
    downRef.current?.click();
  }

  function startRecord() {
    recorderRef.current?.start(1000 / 30);
  }

  function stopRecord() {
    recorderRef.current?.stop();
  }

  return (
    <div>
      <h1>Room</h1>
      <video ref={videoRef} muted autoPlay playsInline></video>
      <video ref={peerVideoRef} autoPlay playsInline></video>
      <Canvas recorderRef={recorderRef} downRef={downRef} />
      <Buttons
        peerRef={peerRef}
        streamRef={streamRef}
        videoRef={videoRef}
        isAudioMuted={isAudioMuted}
        setIsAudioMuted={setIsAudioMuted}
        isVideoMuted={isVideoMuted}
        setIsVideoMuted={setIsVideoMuted}
      />
      <a ref={downRef} download={`Test`} />
      <button onClick={startRecord}>start</button>
      <button onClick={stopRecord}>stop</button>
      <button onClick={downloadRecord}>down</button>
    </div>
  );
}
