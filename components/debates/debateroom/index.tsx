import { useRef, useState } from "react";

import Peer from "simple-peer";

import { useWebSocket } from "../../../utils/debates/debateroom/webSocket";
import { useAutoOff } from "../../../utils/debates/debateroom/useAutoOff";
import { useSetRecorder } from "../../../utils/debates/debateroom/useSetRecorder";
import { usePreventBack } from "../../../utils/debates/debateroom/usePreventBack";

import Canvas from "./Canvas";
import Buttons from "./Buttons";

import { IDebateroom, TTurn } from "../../../types";

export default function Debateroom({
  debateId,
  socketRef,
  debate,
  isPros,
}: Pick<IDebateroom, "debateId" | "socketRef" | "debate" | "isPros">) {
  //* WebRTC 변수
  const peerRef = useRef<Peer.Instance | undefined>();
  //* 캔버스 변수
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  //* 스트림 변수
  const streamRef = useRef<MediaStream | undefined>();
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
  const testARef = useRef<HTMLAnchorElement | null>(null);

  usePreventBack();

  useWebSocket({
    debateId,
    socketRef,
    debate,
    isPros,
    peerRef,
    canvasRef,
    streamRef,
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
  });

  useAutoOff({
    isPros,
    peerRef,
    streamRef,
    videoRef,
    screenStreamRef,
    setIsMicOn,
    setIsScreenOn,
    isPeerScreenOn,
    isReady,
    turn,
  });

  useSetRecorder({
    socketRef,
    debateId,
    canvasRef,
    streamRef,
    peerStream,
    isStart,
    isDoneRef,
    mergedAudioRef,
    recorderRef,
    blobsRef,
    blobRef,
  });

  return (
    <div className="inner">
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
        debate={debate}
        isPros={isPros}
        canvasRef={canvasRef}
        peerStream={peerStream}
        videoRef={videoRef}
        peerVideoRef={peerVideoRef}
        isVideoOn={isVideoOn}
        isPeerVideoOn={isPeerVideoOn}
        isScreenOn={isScreenOn}
        isPeerScreenOn={isPeerScreenOn}
      />
      <Buttons
        debateId={debateId}
        socketRef={socketRef}
        isPros={isPros}
        peerRef={peerRef}
        streamRef={streamRef}
        peerStream={peerStream}
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
        recorderRef={recorderRef}
      />
      <a ref={testARef} download={debate.title} />
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
