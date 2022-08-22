import { useRef, useState } from "react";
import { useRouter } from "next/router";
import Peer from "simple-peer";
import { useQueryClient } from "react-query";

import { useWebSocket } from "../../../utils/debates/debateroom/webSocket";
import { useAutoOff } from "../../../utils/debates/debateroom/useAutoOff";
import { useSetRecorder } from "../../../utils/debates/debateroom/useSetRecorder";
import { usePreventBack } from "../../../utils/debates/debateroom/usePreventBack";
import { queryKeys } from "../../../utils/queries";
import styles from "./index.module.scss";

import ConfirmModal from "../../common/modal/ConfirmModal";
import Canvas from "./Canvas";
import Buttons from "./Buttons";

import { IDebateroom, TTurn } from "../../../types";

export default function Debateroom({
  debateId,
  socketRef,
  debate,
  isPros,
}: Pick<IDebateroom, "debateId" | "socketRef" | "debate" | "isPros">) {
  const router = useRouter();
  const queryClient = useQueryClient();
  //> 모달 변수
  const [isDoneModalOn, setIsDoneModalOn] = useState<boolean>(false);
  const [isPauseModalOn, setIsPauseModalOn] = useState<boolean>(false);
  const [isUploadModalOn, setIsUploadModalOn] = useState<boolean>(false);
  //> WebRTC 변수
  const peerRef = useRef<Peer.Instance | undefined>();
  //> 캔버스 변수
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  //> 스트림 변수
  const streamRef = useRef<MediaStream | undefined>();
  const [peerStream, setPeerStream] = useState<MediaStream | undefined>();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const peerVideoRef = useRef<HTMLVideoElement | null>(null);
  const screenStreamRef = useRef<MediaStream | undefined>();
  //> 토글 변수
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [isVideoOn, setIsVideoOn] = useState<boolean>(false);
  const [isPeerVideoOn, setIsPeerVideoOn] = useState<boolean>(false);
  const [isScreenOn, setIsScreenOn] = useState<boolean>(false);
  const [isPeerScreenOn, setIsPeerScreenOn] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  //> 토론 변수
  const [isStart, setIsStart] = useState<boolean>(false);
  const isDoneRef = useRef<boolean>(false);
  const [turn, setTurn] = useState<TTurn>("none");
  const [isSkipTime, setIsSkipTime] = useState<boolean>(false);
  //> 녹화 변수
  const mergedAudioRef = useRef<MediaStreamTrack[] | undefined>();
  const recorderRef = useRef<MediaRecorder | undefined>();
  const blobsRef = useRef<Blob[]>([]);
  const blobRef = useRef<Blob | undefined>();
  const aRef = useRef<HTMLAnchorElement | null>(null);

  usePreventBack();

  useWebSocket({
    debateId,
    socketRef,
    debate,
    isPros,
    setIsDoneModalOn,
    setIsUploadModalOn,
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
    setIsSkipTime,
    mergedAudioRef,
    recorderRef,
    blobRef,
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
    setIsPauseModalOn,
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
    <>
      {isDoneModalOn ? (
        <ConfirmModal
          title={"토론 종료"}
          content={"토론이 종료되었습니다.\n녹화 영상을 다운받으시겠습니까?"}
          firstBtn={"아니요"}
          firstFunc={() => {
            streamRef.current?.getTracks().forEach((track) => {
              track.stop();
            });
            peerRef.current?.destroy();
            socketRef.current.disconnect();
            queryClient.invalidateQueries([queryKeys.debates, `${debateId}`]);
            router.push(`/${debateId}`);
          }}
          secondBtn={"네"}
          secondFunc={() => {
            streamRef.current?.getTracks().forEach((track) => {
              track.stop();
            });
            if (!blobRef.current) return;
            const url = window.URL.createObjectURL(blobRef.current);
            if (!aRef.current) return;
            aRef.current.href = url;
            aRef.current?.click();
            window.URL.revokeObjectURL(url);
            peerRef.current?.destroy();
            socketRef.current.disconnect();
            queryClient.invalidateQueries([queryKeys.debates, `${debateId}`]);
            router.push(`/${debateId}`);
          }}
        />
      ) : null}
      {isPauseModalOn ? (
        <ConfirmModal
          title={"토론 중단"}
          content={
            "토론이 중단되었습니다. 진행된 부분까지 녹화 영상을 업로드하고 토론을 끝내시겠습니까? 아니면 토론을 처음부터 다시 시작하시겠습니까?"
          }
          firstBtn={"다시하기"}
          firstFunc={() => {
            setIsPauseModalOn(false);
          }}
          secondBtn={"끝내기"}
          secondFunc={() => {
            socketRef.current.emit("debateDone", { debateId });
            setIsPauseModalOn(false);
          }}
        />
      ) : null}
      {isUploadModalOn ? (
        <ConfirmModal
          title={"토론 업로드"}
          content={"토론이 업로드 중입니다. 잠시만 기다려 주십시오."}
        />
      ) : null}
      <div className="inner">
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
        <div className={styles.video_box}>
          <video
            ref={videoRef}
            muted
            autoPlay
            playsInline
            width={0.1}
            height={0.1}
          ></video>
        </div>
        <div className={styles.video_box}>
          <video
            ref={peerVideoRef}
            muted
            autoPlay
            playsInline
            width={0.1}
            height={0.1}
          ></video>
        </div>
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
          isSkipTime={isSkipTime}
          recorderRef={recorderRef}
        />
        <a ref={aRef} download={`${debate.title}.webm`} />
      </div>
    </>
  );
}
