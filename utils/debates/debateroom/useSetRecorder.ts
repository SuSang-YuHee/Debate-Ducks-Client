import { useEffect, useRef } from "react";
import toast from "react-hot-toast";
import ysFixWebmDuration from "fix-webm-duration";

import { IDebateroom } from "../../../types";

//# 녹화
export const useSetRecorder = ({
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
}: Pick<
  IDebateroom,
  | "socketRef"
  | "debateId"
  | "setIsPauseModalOn"
  | "canvasRef"
  | "streamRef"
  | "peerStream"
  | "isStart"
  | "isDoneRef"
  | "mergedAudioRef"
  | "recorderRef"
  | "blobsRef"
  | "blobRef"
>) => {
  const startTimeRef = useRef<number>(Date.now());

  useEffect(() => {
    if (!isStart) return;
    //> 오디오 합침
    mergeAudio({ streamRef, peerStream, mergedAudioRef });
    //> 녹화 설정
    setRecorder({
      socketRef,
      debateId,
      setIsPauseModalOn,
      canvasRef,
      isDoneRef,
      mergedAudioRef,
      recorderRef,
      blobsRef,
      blobRef,
      startTimeRef,
    });
    //> 녹화 시작
    if (recorderRef.current?.state !== "recording") {
      recorderRef.current?.start(1000 / 30);
      startTimeRef.current = Date.now();
    }
  }, [
    blobRef,
    blobsRef,
    canvasRef,
    debateId,
    isDoneRef,
    isStart,
    mergedAudioRef,
    peerStream,
    recorderRef,
    setIsPauseModalOn,
    socketRef,
    streamRef,
  ]);
};

//# utils
//> 오디오 합치기
function mergeAudio({
  streamRef,
  peerStream,
  mergedAudioRef,
}: Pick<IDebateroom, "streamRef" | "peerStream" | "mergedAudioRef">) {
  const merge = ({
    streamRef,
    peerStream,
  }: Pick<IDebateroom, "streamRef" | "peerStream">) => {
    if (!streamRef.current || !peerStream) return;

    const ctx = new AudioContext();
    const destination = ctx.createMediaStreamDestination();

    const source1 = ctx.createMediaStreamSource(streamRef.current);
    const source1Gain = ctx.createGain();
    source1.connect(source1Gain).connect(destination);

    const source2 = ctx.createMediaStreamSource(peerStream);
    const source2Gain = ctx.createGain();
    source2.connect(source2Gain).connect(destination);

    return destination.stream.getAudioTracks();
  };

  mergedAudioRef.current = merge({ streamRef, peerStream });
}

//> 녹화 설정
function setRecorder({
  socketRef,
  debateId,
  setIsPauseModalOn,
  canvasRef,
  isDoneRef,
  mergedAudioRef,
  recorderRef,
  blobsRef,
  blobRef,
  startTimeRef,
}: Pick<
  IDebateroom,
  | "socketRef"
  | "debateId"
  | "setIsPauseModalOn"
  | "canvasRef"
  | "isDoneRef"
  | "mergedAudioRef"
  | "recorderRef"
  | "blobsRef"
  | "blobRef"
  | "startTimeRef"
>) {
  //- 30fps로 캔버스 요소 녹화
  const canvasStream = canvasRef.current?.captureStream(30);

  if (!canvasStream || !mergedAudioRef.current) return;
  //- 캔버스 녹화 영상과 합친 오디오 병합
  const mergedTracks = canvasStream
    .getVideoTracks()
    .concat(mergedAudioRef.current);

  if (!mergedTracks) return;
  const mergedStream = new MediaStream(mergedTracks);

  if (!mergedStream) return;
  let recorder;
  try {
    recorder = new MediaRecorder(mergedStream, {
      mimeType: "video/webm",
    });
  } catch (err1) {
    try {
      recorder = new MediaRecorder(mergedStream, {
        mimeType: "video/mp4",
      });
    } catch (err2) {
      toast.error("녹화 준비에 실패 했습니다.");
    }
  }

  if (!recorder) return;
  recorderRef.current = recorder;
  //- 녹화 중
  recorderRef.current.ondataavailable = (ev) => {
    blobsRef.current.push(ev.data);
  };
  //- 녹화 종료 후
  recorderRef.current.onstop = () => {
    const duration = Date.now() - startTimeRef.current;
    const blob = new Blob(blobsRef.current, {
      type: "video/webm",
    });
    ysFixWebmDuration(blob, duration, { logger: false }).then((fixedBlob) => {
      blobRef.current = fixedBlob;
    });
    blobsRef.current = [];

    if (isDoneRef.current) {
      socketRef.current.emit("debateDone", { debateId });
    } else {
      setIsPauseModalOn(true);
    }
  };
}
