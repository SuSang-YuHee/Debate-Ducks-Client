import { MutableRefObject, useEffect, useRef, useState } from "react";
import { Socket } from "socket.io-client";
import Peer from "simple-peer";

import { toggleMic } from "./utils/toggle";
import { offScreen } from "./utils/screenShare";
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
  isPros: boolean; //!
}

export default function Room({ debateId, socket, isPros }: IRoomProps) {
  //*- WebRTC 변수
  const [reConnect, setReconnect] = useState<boolean>(false);
  const peerRef = useRef<Peer.Instance | undefined>();
  //*- 캔버스 변수
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  //*- 스트림 변수
  const [stream, setStream] = useState<MediaStream | undefined>();
  const [peerStream, setPeerStream] = useState<MediaStream | undefined>();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const peerVideoRef = useRef<HTMLVideoElement | null>(null);
  const screenStreamRef = useRef<MediaStream | undefined>();
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [isVideoOn, setIsVideoOn] = useState<boolean>(false);
  const [isPeerVideoOn, setIsPeerVideoOn] = useState<boolean>(false);
  const [isScreenOn, setIsScreenOn] = useState<boolean>(false);
  const [isPeerScreenOn, setIsPeerScreenOn] = useState<boolean>(false);
  //*- 토론 변수
  const [isReady, setIsReady] = useState<boolean>(false);
  const [isStart, setIsStart] = useState<boolean>(false);
  const [turn, setTurn] = useState<
    "none" | "notice" | "pros" | "cons" | "prosCross" | "consCross"
  >("none");

  //! 임시 변수
  const [dummy] = useState<IDummy>({
    topic: "Is Alien Exist?",
    prosName: "이찬성",
    consName: "반대중",
  });

  //*- Socket and WebRTC 연결
  useEffect(() => {
    wsConnect(
      debateId,
      socket,
      isPros,
      peerRef,
      canvasRef,
      setStream,
      setPeerStream,
      videoRef,
      peerVideoRef,
      setIsPeerVideoOn,
      setIsPeerScreenOn,
      setIsStart,
      setTurn,
      dummy.topic,
    );
  }, [debateId, socket, isPros, reConnect, dummy.topic]);

  //*- Socket and WebRTC 연결 해제
  useEffect(() => {
    wsDisconnect(
      socket,
      reConnect,
      setReconnect,
      peerRef,
      setPeerStream,
      peerVideoRef,
      screenStreamRef,
      setIsPeerVideoOn,
      setIsScreenOn,
      setIsPeerScreenOn,
    );
  }, [debateId, socket, reConnect]);

  //*- 토글 정보 송신
  useEffect(() => {
    wsTransmitVideo(debateId, socket, peerRef, isVideoOn);
  }, [debateId, socket, peerStream, isVideoOn]);

  useEffect(() => {
    wsTransmitScreen(debateId, socket, peerRef, isScreenOn);
  }, [debateId, socket, isScreenOn]);

  useEffect(() => {
    wsTransmitReady(debateId, socket, isPros, isReady);
  }, [debateId, socket, isPros, isReady]);

  //*- 끄기/켜기 처리
  // * 턴 전환 시 오디오 및 화면 공유 끄기
  useEffect(() => {
    if (turn === "none") return;

    if (isPros) {
      if (turn === "pros" || turn === "prosCross") {
        toggleMic(stream, true, setIsMicOn);
      } else {
        toggleMic(stream, false, setIsMicOn);
      }
    } else {
      if (turn === "cons" || turn === "consCross") {
        toggleMic(stream, true, setIsMicOn);
      } else {
        toggleMic(stream, false, setIsMicOn);
      }
    }
    offScreen(peerRef, stream, videoRef, screenStreamRef, setIsScreenOn);
  }, [stream, turn, isPros]);

  // * 상대 화면 공유 시 화면 공유 끄기
  useEffect(() => {
    if (isPeerScreenOn)
      offScreen(peerRef, stream, videoRef, screenStreamRef, setIsScreenOn);
  }, [stream, isPeerScreenOn]);

  // * 재연결 시 화면 공유 끄기
  useEffect(() => {
    if (stream && videoRef.current && screenStreamRef.current) {
      screenStreamRef.current.getTracks()[0].stop();
      videoRef.current.srcObject = stream;
      setIsScreenOn(false);
      screenStreamRef.current = undefined;
    }
  }, [stream, peerStream]);

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
    </div>
  );
}
