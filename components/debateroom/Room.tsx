import { MutableRefObject, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import Peer from "simple-peer";

import { useWebSocket } from "./utils/webSocket/webSocket";
import { useOffScreenShare } from "./utils/useOffScreenShare";
import { useSetRecorder } from "./utils/webSocket/useSetRecorder";

import Canvas from "./Canvas";
import Buttons from "./Buttons";

import { IDummy } from "./types";

interface IRoomProps {
  debateId: string | string[] | undefined;
  socket: MutableRefObject<Socket | undefined>;
  isPros: boolean; //! 임시 props 타입
}

export default function Room({ debateId, socket, isPros }: IRoomProps) {
  //* WebRTC 변수
  const peerRef = useRef<Peer.Instance | undefined>();
  const [isHost, setIsHost] = useState<boolean>(false);
  //* 캔버스 변수
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  //* 스트림 변수
  const [stream, setStream] = useState<MediaStream | undefined>();
  const [peerStream, setPeerStream] = useState<MediaStream | undefined>();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const peerVideoRef = useRef<HTMLVideoElement | null>(null);
  const screenStreamRef = useRef<MediaStream | undefined>();
  //* 토글 변수
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [isVideoOn, setIsVideoOn] = useState<boolean>(false);
  const [isPeerVideoOn, setIsPeerVideoOn] = useState<boolean>(false);
  const [isScreenOn, setIsScreenOn] = useState<boolean>(false);
  const [isPeerScreenOn, setIsPeerScreenOn] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  //* 토론 변수
  const [isStart, setIsStart] = useState<boolean>(false);
  const mergedAudioRef = useRef<MediaStreamTrack[] | undefined>();
  const recorderRef = useRef<MediaRecorder | undefined>();
  const [turn, setTurn] = useState<
    "none" | "pros" | "cons" | "prosCross" | "consCross"
  >("none");

  //! 임시 변수
  const [dummy] = useState<IDummy>({
    topic: "Is Alien Exist?",
    prosName: "이찬성",
    consName: "반대중",
  });
  const testARef = useRef<HTMLAnchorElement | null>(null);
  const blobsRef = useRef<Blob[]>([]);

  useWebSocket({
    debateId,
    socket,
    isPros,
    setIsHost,
    peerRef,
    canvasRef,
    stream,
    setStream,
    peerStream,
    setPeerStream,
    videoRef,
    peerVideoRef,
    screenStreamRef,
    isVideoOn,
    setIsPeerVideoOn,
    isScreenOn,
    setIsScreenOn,
    setIsPeerScreenOn,
    isReady,
    setIsReady,
    setIsStart,
    mergedAudioRef,
    recorderRef,
    setTurn,
    dummy,
    blobsRef,
  });

  useOffScreenShare({
    isPros,
    peerRef,
    stream,
    peerStream,
    videoRef,
    screenStreamRef,
    setIsMicOn,
    setIsScreenOn,
    isPeerScreenOn,
    turn,
  });

  useSetRecorder({
    debateId,
    socket,
    isHost,
    canvasRef,
    stream,
    peerStream,
    isStart,
    mergedAudioRef,
    recorderRef,
  });

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
        isPros={isPros}
        peerRef={peerRef}
        canvasRef={canvasRef}
        videoRef={videoRef}
        peerVideoRef={peerVideoRef}
        isVideoOn={isVideoOn}
        isPeerVideoOn={isPeerVideoOn}
        isScreenOn={isScreenOn}
        isPeerScreenOn={isPeerScreenOn}
        dummy={dummy}
      />
      <Buttons
        debateId={debateId}
        socket={socket}
        isPros={isPros}
        peerRef={peerRef}
        stream={stream}
        videoRef={videoRef}
        screenStreamRef={screenStreamRef}
        isMicOn={isMicOn}
        setIsMicOn={setIsMicOn}
        isVideoOn={isVideoOn}
        setIsVideoOn={setIsVideoOn}
        isScreenOn={isScreenOn}
        setIsScreenOn={setIsScreenOn}
        isReady={isReady}
        setIsReady={setIsReady}
        isStart={isStart}
        turn={turn}
      />
      {isStart ? "start" : "waiting"}
      <a ref={testARef} download={dummy.topic} />
      <button
        onClick={() => {
          // const mergedBlob = new Blob(blobsRef.current, {
          //   type: "video/webm",
          // });
          const mergedBlob = blobsRef.current.reduce(
            (a, b) => new Blob([a, b], { type: "video/webm" }),
          );
          const url = window.URL.createObjectURL(mergedBlob);
          if (testARef.current) testARef.current.href = url;

          console.log(mergedBlob); //! console
        }}
      >
        merge
      </button>
      <button
        onClick={() => {
          testARef.current?.click();
        }}
      >
        Down
      </button>
      <button
        onClick={() => {
          console.log(blobsRef.current);
        }}
      >
        test
      </button>
    </div>
  );
}
