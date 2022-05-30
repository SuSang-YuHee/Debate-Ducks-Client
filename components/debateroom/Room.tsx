import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import Peer from "simple-peer";

import { toggleVideo } from "./utils/toggle";
import {
  wsConnect,
  wsDisconnect,
  wsTransmitVideo,
  wsTransmitScreen,
  wsTransmitReady,
} from "./utils/webSocket";

import Canvas from "./Canvas";
import Buttons from "./Buttons";

import { IDummy } from "./types";

interface IRoomProps {
  debateId: string | string[] | undefined;
  socket: MutableRefObject<Socket | undefined>;
}

export default function Room({ debateId, socket }: IRoomProps) {
  //*- WebRTC 변수
  const [reConnect, setReconnect] = useState<boolean>(false);
  const [peer, setPeer] = useState<Peer.Instance | undefined>();
  //*- 캔버스 변수
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  //*- 녹화 변수
  const recorderRef = useRef<MediaRecorder | undefined>();
  const downRef = useRef<HTMLAnchorElement | null>(null);
  //*- 스트림 변수
  const streamRef = useRef<MediaStream | undefined>();
  const peerStreamRef = useRef<MediaStream | undefined>();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const peerVideoRef = useRef<HTMLVideoElement | null>(null);
  const screenStreamRef = useRef<MediaStream | undefined>();
  const [isAudioOn, setIsAudioOn] = useState<boolean>(true);
  const [isVideoOn, setIsVideoOn] = useState<boolean>(false);
  const [isPeerVideoOn, setIsPeerVideoOn] = useState<boolean>(false);
  const [isScreenOn, setIsScreenOn] = useState<boolean>(false);
  const [isPeerScreenOn, setIsPeerScreenOn] = useState<boolean>(false);
  //*- 토론 변수
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isStart, setIsStart] = useState<boolean>(false);
  const [turn, setTurn] = useState<
    "notice" | "pros" | "cons" | "prosCross" | "consCross"
  >("notice");

  //! 임시 변수
  const [dummy] = useState<IDummy>({
    topic: "Is Alien Exist?",
    prosName: "이찬성",
    consName: "반대중",
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

  //*- Socket and WebRTC 연결
  useEffect(() => {
    wsConnect(
      debateId,
      socket,
      setPeer,
      canvasRef,
      streamRef,
      peerStreamRef,
      videoRef,
      peerVideoRef,
      setIsPeerVideoOn,
      setIsPeerScreenOn,
      setIsStart,
      setTurn,
      dummy.topic,
    );
  }, [debateId, socket, reConnect, dummy.topic]);

  //*- Socket and WebRTC 연결 해제
  useEffect(() => {
    wsDisconnect(
      socket,
      reConnect,
      setReconnect,
      peer,
      setPeer,
      peerStreamRef,
      peerVideoRef,
      screenStreamRef,
      setIsPeerVideoOn,
      setIsScreenOn,
      setIsPeerScreenOn,
    );
  }, [debateId, socket, reConnect, peer]);

  //*- 정보 송신
  useEffect(() => {
    wsTransmitVideo(debateId, socket, peer, isVideoOn);
  }, [debateId, socket, peer, isVideoOn]);

  useEffect(() => {
    wsTransmitScreen(debateId, socket, peer, isScreenOn);
  }, [debateId, socket, peer, isScreenOn]);

  useEffect(() => {
    wsTransmitReady(debateId, socket, isReady, isPros);
  }, [debateId, socket, isReady, isPros]);

  //*- 첫 입장 시 비디오 끄기
  useEffect(() => {
    toggleVideo(streamRef, false, setIsAudioOn);
  }, []);

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
        muted //! 테스트용
        autoPlay
        playsInline
        width={0}
        height={0}
        style={{ position: "sticky", top: 0 }}
      ></video>
      <Canvas
        peer={peer}
        canvasRef={canvasRef}
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
        turn={turn}
      />
      <Buttons
        peer={peer}
        streamRef={streamRef}
        videoRef={videoRef}
        screenStreamRef={screenStreamRef}
        isAudioOn={isAudioOn}
        setIsAudioOn={setIsAudioOn}
        isVideoOn={isVideoOn}
        setIsVideoOn={setIsVideoOn}
        isScreenOn={isScreenOn}
        setIsScreenOn={setIsScreenOn}
        isReady={isReady}
        setIsReady={setIsReady}
        isStart={isStart}
      />
      <a ref={downRef} download={`Test`} />
      <button onClick={startRecord}>recordStart</button>
      <button onClick={stopRecord}>recordStop</button>
      <button onClick={downloadRecord}>recordDown</button>
      <button onClick={() => setIsPros(!isPros)}>
        {isPros ? "Now pros" : "Now cons"}
      </button>
      {isStart ? "start" : "waiting"}
    </div>
  );
}
