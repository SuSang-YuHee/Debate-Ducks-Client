import { MutableRefObject, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import Peer from "simple-peer";

import { IDummy } from "./types";
import { connectHostPeer, connectGuestPeer } from "./utils/simple-peer";

import Canvas from "./Canvas";
import Buttons from "./Buttons";

interface IRoomProps {
  debateId: string | string[] | undefined;
  socket: MutableRefObject<Socket | undefined>;
}

export default function Room({ debateId, socket }: IRoomProps) {
  const [reConnect, setReConnect] = useState<boolean>(false);
  const [peer, setPeer] = useState<Peer.Instance | undefined>();
  const recorderRef = useRef<MediaRecorder | undefined>();
  const downRef = useRef<HTMLAnchorElement | null>(null);
  const streamRef = useRef<MediaStream | undefined>();
  const peerStreamRef = useRef<MediaStream | undefined>();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const peerVideoRef = useRef<HTMLVideoElement | null>(null);
  const [isAudioOn, setIsAudioOn] = useState<boolean>(true);
  const [isVideoOn, setIsVideoOn] = useState<boolean>(false);
  const [isPeerVideoOn, setIsPeerVideoOn] = useState<boolean>(false);
  const [isScreenOn, setIsScreenOn] = useState<boolean>(false);
  const [isPeerScreenOn, setIsPeerScreenOn] = useState<boolean>(false);
  const [isStart, setIsStart] = useState(false);

  //! 임시 변수
  const [dummy] = useState<IDummy>({
    topic: "Is Alien Exist?",
    prosName: "이찬성",
    consName: "반대중",
    prosTurn: "false",
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

  //
  useEffect(() => {
    if (debateId && socket.current) {
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

      socket.current.emit("join", { debateId });

      socket.current.on("overcapacity", () => {
        console.log("overcapacity"); //!
      });

      socket.current.on("guestJoin", () => {
        console.log("guest join"); //!
        connectHostPeer(
          debateId,
          socket,
          setPeer,
          streamRef,
          peerStreamRef,
          peerVideoRef,
        );
      });

      socket.current.on("offer", (signal: Peer.SignalData) => {
        console.log("offer"); //!
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

      socket.current.on("peerVideo", (isPeerVideoOn: boolean) => {
        setIsPeerVideoOn(isPeerVideoOn);
      });

      socket.current.on("peerScreen", (isPeerScreenOn: boolean) => {
        setIsPeerScreenOn(isPeerScreenOn);
      });
    }
  }, [debateId, socket, reConnect]);

  //!
  useEffect(() => {
    socket.current?.on("peerDisconnect", (peerId) => {
      console.log("peerDisconnect", peerId); //!
      peer?.destroy();
      setPeer(undefined);
      socket.current?.disconnect();
      socket.current = io(`${process.env.NEXT_PUBLIC_API_URL}`);
      setReConnect(!reConnect);
    });
  }, [debateId, socket, reConnect, peer]);

  useEffect(() => {
    if (peer) {
      socket.current?.emit("peerVideo", { debateId, isVideoOn });
      socket.current?.emit("peerScreen", { debateId, isScreenOn });
    }
  }, [debateId, socket, peer, isVideoOn, isScreenOn]);

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
