import { useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import Peer from "simple-peer";

import { IDummy } from "./types";
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
  const [
    /*isPeerVideoMuted, setIsPeerVideoMuted*/
  ] = useState<boolean>(false);
  const [, /*isScreenOn*/ setIsScreenOn] = useState<boolean>(false);
  const [
    /*isPeerScreenOn, setIsPeerScreenOn*/
  ] = useState<boolean>(false);

  const recorderRef = useRef<MediaRecorder>();
  const downRef = useRef<HTMLAnchorElement>(null);

  //! 임시 변수
  const [dummy] = useState<IDummy>({
    topic: "Is Alien Exist?",
    isPros: true,
    isProsTurn: true,
    prosName: "이찬성",
    consName: "반대중",
  });

  useEffect(() => {
    if (debateId && socket) {
      navigator.mediaDevices
        .getUserMedia({
          video: { facingMode: "user", width: 500, height: 500 },
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

  // useEffect(() => {}, [isProScreenOn /*isConScreenOn, isProTurn*/]);

  //! 임시 함수
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
      <video
        ref={videoRef}
        muted
        autoPlay
        playsInline
        width={0}
        height={0}
        style={{ position: "sticky", top: 0 }}
      ></video>
      <video
        ref={peerVideoRef}
        autoPlay
        playsInline
        width={0}
        height={0}
        style={{ position: "sticky", top: 0 }}
      ></video>
      <Canvas
        recorderRef={recorderRef}
        downRef={downRef}
        videoRef={videoRef}
        peerVideoRef={peerVideoRef}
        dummy={dummy}
      />
      <Buttons
        debateId={debateId}
        socket={socket}
        peerRef={peerRef}
        streamRef={streamRef}
        videoRef={videoRef}
        isAudioMuted={isAudioMuted}
        setIsAudioMuted={setIsAudioMuted}
        isVideoMuted={isVideoMuted}
        setIsVideoMuted={setIsVideoMuted}
        setIsScreenOn={setIsScreenOn}
      />
      <a ref={downRef} download={`Test`} />
      <button onClick={startRecord}>recordStart</button>
      <button onClick={stopRecord}>recordStop</button>
      <button onClick={downloadRecord}>recordDown</button>
    </div>
  );
}
