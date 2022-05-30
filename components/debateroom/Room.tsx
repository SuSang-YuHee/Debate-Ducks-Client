import { MutableRefObject, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import Peer from "simple-peer";

import { IDummy } from "./types";
import { connectHostPeer, connectGuestPeer } from "./utils/simple-peer";
import { toggleVideoOnOff } from "./utils/toggleOnOff";

import Canvas from "./Canvas";
import Buttons from "./Buttons";

interface IRoomProps {
  debateId: string | string[] | undefined;
  socket: MutableRefObject<Socket | undefined>;
}

export default function Room({ debateId, socket }: IRoomProps) {
  //* WebRTC 변수
  const [reConnect, setReConnect] = useState<boolean>(false);
  const [peer, setPeer] = useState<Peer.Instance | undefined>();
  //* 녹화 변수
  const recorderRef = useRef<MediaRecorder | undefined>();
  const downRef = useRef<HTMLAnchorElement | null>(null);
  //* 스트림 변수
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
  //* Etc.
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

  //* Room and WebRTC 연결
  useEffect(() => {
    if (debateId && socket.current) {
      //* 사용자 미디어 획득
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

      //* 방 입장
      socket.current.emit("join", { debateId });

      //* 방 입장 거절
      socket.current.on("overcapacity", () => {
        console.log("overcapacity"); //! 추가 처리 필요
      });

      //* offer and answer
      socket.current.on("guestJoin", () => {
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

      //* 끄기/켜기 정보 수신
      socket.current.on("peerVideo", (isPeerVideoOn: boolean) => {
        setIsPeerVideoOn(isPeerVideoOn);
      });

      socket.current.on("peerScreen", (isPeerScreenOn: boolean) => {
        setIsPeerScreenOn(isPeerScreenOn);
      });
    }
  }, [debateId, socket, reConnect]);

  //* Room and WebRTC 연결 해제
  useEffect(() => {
    socket.current?.on("peerDisconnect", () => {
      peer?.destroy();
      setPeer(undefined);
      socket.current?.disconnect();
      socket.current = io(`${process.env.NEXT_PUBLIC_API_URL}`);

      streamRef.current = undefined;
      peerStreamRef.current = undefined;
      if (videoRef.current) videoRef.current.srcObject = null;
      if (peerVideoRef.current) peerVideoRef.current.srcObject = null;
      if (screenStreamRef.current) {
        screenStreamRef.current.getTracks()[0].stop();
      }
      setIsPeerVideoOn(false);
      setIsScreenOn(false);
      setIsPeerScreenOn(false);

      setReConnect(!reConnect);
    });
  }, [debateId, socket, reConnect, peer]);

  //* 끄기/켜기 정보 송신
  useEffect(() => {
    if (peer) {
      socket.current?.emit("peerVideo", { debateId, isVideoOn });
      socket.current?.emit("peerScreen", { debateId, isScreenOn });
    }
  }, [debateId, socket, peer, isVideoOn, isScreenOn]);

  //* 첫 입장시 비디오 끄기
  useEffect(() => {
    toggleVideoOnOff(streamRef, false, setIsAudioOn);
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
        screenStreamRef={screenStreamRef}
        isAudioOn={isAudioOn}
        setIsAudioOn={setIsAudioOn}
        isVideoOn={isVideoOn}
        setIsVideoOn={setIsVideoOn}
        isScreenOn={isScreenOn}
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
