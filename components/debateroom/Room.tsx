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
  const [peer, setPeer] = useState<Peer.Instance>();
  const recorderRef = useRef<MediaRecorder>();
  const downRef = useRef<HTMLAnchorElement>(null);
  const streamRef = useRef<MediaStream>();
  const peerStreamRef = useRef<MediaStream>();
  const videoRef = useRef<HTMLVideoElement>(null);
  const peerVideoRef = useRef<HTMLVideoElement>(null);
  const [isAudioOn, setIsAudioOn] = useState<boolean>(true);
  const [isVideoOn, setIsVideoOn] = useState<boolean>(true);
  const [isPeerVideoOn, setIsPeerVideoOn] = useState<boolean>(true);
  const [isScreenOn, setIsScreenOn] = useState<boolean>(false);
  const [isPeerScreenOn, setIsPeerScreenOn] = useState<boolean>(false);
  const [isStart, setIsStart] = useState(false);

  //! 임시 변수
  const [dummy] = useState<IDummy>({
    topic: "Is Alien Exist?",
    prosName: "이찬성",
    consName: "반대중",
    isProsTurn: true,
  });
  const [isPros, setIsPros] = useState(true);

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
          setPeer,
          streamRef,
          peerStreamRef,
          peerVideoRef,
        );
      });

      socket.on("offer", (signal: Peer.SignalData) => {
        connectGuestPeer(
          debateId,
          socket,
          setPeer,
          streamRef,
          peerStreamRef,
          peerVideoRef,
          signal,
        );
      });

      socket.on("peerVideo", (isPeerVideoOn: boolean) => {
        setIsPeerVideoOn(isPeerVideoOn);
      });

      socket.on("peerScreen", (isPeerScreenOn: boolean) => {
        setIsPeerScreenOn(isPeerScreenOn);
      });
    }
  }, [debateId, socket]);

  useEffect(() => {
    if (peer) {
      socket?.emit("peerVideo", { debateId, isVideoOn });
      socket?.emit("peerScreen", { debateId, isPeerScreenOn });
    }
  }, [socket, peer, debateId, isVideoOn, isPeerScreenOn]);

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
        peer={peer}
        recorderRef={recorderRef}
        downRef={downRef}
        videoRef={videoRef}
        peerVideoRef={peerVideoRef}
        isVideoOn={isVideoOn}
        isPeerVideoOn={isPeerVideoOn}
        isScreenOn={isScreenOn}
        isPeerScreenOn={isPeerScreenOn}
        isStart={isStart}
        dummy={dummy}
        isPros={isPros}
      />
      <Buttons
        peer={peer}
        streamRef={streamRef}
        videoRef={videoRef}
        isAudioOn={isAudioOn}
        setIsAudioOn={setIsAudioOn}
        isVideoOn={isVideoOn}
        setIsVideoOn={setIsVideoOn}
        setIsScreenOn={setIsScreenOn}
      />
      <a ref={downRef} download={`Test`} />
      <button onClick={startRecord}>recordStart</button>
      <button onClick={stopRecord}>recordStop</button>
      <button onClick={downloadRecord}>recordDown</button>
      <button onClick={() => setIsPros(!isPros)}>
        {isPros ? "Now pros" : "Now cons"}
      </button>
      <button onClick={() => setIsStart(!isStart)}>
        {isStart ? "Now start" : "No start"}
      </button>
    </div>
  );
}
