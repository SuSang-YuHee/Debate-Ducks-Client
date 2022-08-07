import { MutableRefObject, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import Peer from "simple-peer";

import { useWebSocket } from "../../../utils/debates/debateroom/webSocket";
import { useAutoOff } from "../../../utils/debates/debateroom/useAutoOff";
import { useSetRecorder } from "../../../utils/debates/debateroom/useSetRecorder";

import Canvas from "./Canvas";
import Buttons from "./Buttons";

import { IDummy, TTurn } from "../../../types";
import usePreventBack from "../../../utils/debates/debateroom/usePreventBack";
import { useRouter } from "next/router";

interface IRoomProps {
  debateId: string | string[] | undefined;
  socket: MutableRefObject<Socket | undefined>;
  isPros: boolean;
}

export default function DebateRoom({ debateId, socket, isPros }: IRoomProps) {
  const router = useRouter();
  //* WebRTC 변수
  const peerRef = useRef<Peer.Instance | undefined>();
  const isHostRef = useRef<boolean>(false);
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
  const isDoneRef = useRef<boolean>(false);
  const [turn, setTurn] = useState<TTurn>("none");
  const timeRef = useRef<number>(0);
  //* 녹화 변수
  const mergedAudioRef = useRef<MediaStreamTrack[] | undefined>();
  const recorderRef = useRef<MediaRecorder | undefined>();
  const blobsRef = useRef<Blob[]>([]); //Todo: 재시작 시 비우기
  const blobRef = useRef<Blob | undefined>();

  //! 임시
  const [dummy] = useState<IDummy>({
    topic: "Is Alien Exist?",
    prosName: "이찬성",
    consName: "반대중",
  });
  const testARef = useRef<HTMLAnchorElement | null>(null);

  usePreventBack();

  useWebSocket({
    debateId,
    socket,
    isPros,
    peerRef,
    isHostRef,
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
    isDoneRef,
    setTurn,
    timeRef,
    mergedAudioRef,
    recorderRef,
    blobsRef,
    dummy,
  });

  useAutoOff({
    isPros,
    peerRef,
    stream,
    peerStream,
    videoRef,
    screenStreamRef,
    setIsMicOn,
    setIsScreenOn,
    isPeerScreenOn,
    isReady,
    turn,
  });

  useSetRecorder({
    socket,
    debateId,
    isHostRef,
    canvasRef,
    stream,
    peerStream,
    isStart,
    isDoneRef,
    mergedAudioRef,
    recorderRef,
    blobsRef,
    blobRef,
  });

  function handleExit() {
    socket.current?.disconnect();
    router.push(`/${debateId}`);
  }

  return (
    <div>
      <h1>Room</h1>
      <div onClick={handleExit}>나가기</div>
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
        timeRef={timeRef}
      />
      <a ref={testARef} download={dummy.topic} />
      <button
        onClick={() => {
          if (!blobRef.current) return;
          const url = window.URL.createObjectURL(blobRef.current);
          if (!testARef.current) return;
          testARef.current.href = url;
          testARef.current?.click();
          window.URL.revokeObjectURL(url);
        }}
      >
        TempDown
      </button>
    </div>
  );
}
