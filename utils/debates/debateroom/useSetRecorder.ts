import { useEffect } from "react";

import { upload } from "./upload";

import { IDebateroom } from "../../../types";

export const useSetRecorder = ({
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
}: Pick<
  IDebateroom,
  | "socketRef"
  | "debateId"
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
  useEffect(() => {
    if (!isStart) return;
    mergeAudio({ streamRef, peerStream, mergedAudioRef });
    setRecorder({
      socketRef,
      debateId,
      canvasRef,
      isDoneRef,
      mergedAudioRef,
      recorderRef,
      blobsRef,
      blobRef,
    });
    if (recorderRef.current?.state !== "recording") {
      recorderRef.current?.start(1000 / 30);
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
    socketRef,
    streamRef,
  ]);
};

//*- utils
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

function setRecorder({
  socketRef,
  debateId,
  canvasRef,
  isDoneRef,
  mergedAudioRef,
  recorderRef,
  blobsRef,
  blobRef,
}: Pick<
  IDebateroom,
  | "socketRef"
  | "debateId"
  | "canvasRef"
  | "isDoneRef"
  | "mergedAudioRef"
  | "recorderRef"
  | "blobsRef"
  | "blobRef"
>) {
  const canvasStream = canvasRef.current?.captureStream(30);

  if (!canvasStream || !mergedAudioRef.current) return;
  const mergedTracks = canvasStream
    .getVideoTracks()
    .concat(mergedAudioRef.current);

  if (!mergedTracks) return;
  const mergedStream = new MediaStream(mergedTracks);

  if (!mergedStream) return;
  const recorder = new MediaRecorder(mergedStream, {
    mimeType: "video/webm",
  });

  if (!recorder) return;
  recorderRef.current = recorder;
  recorderRef.current.ondataavailable = (ev) => {
    blobsRef.current.push(ev.data);
  };
  recorderRef.current.onstop = () => {
    const blob = new Blob(blobsRef.current, {
      type: "video/webm",
    });
    blobRef.current = blob;
    console.log("녹화 중지", blobRef.current);

    if (isDoneRef.current) {
      upload({ socketRef, debateId, blobRef });
    } else {
      //Todo: 재시작 모달
      console.log("재시작 모달");
    }
  };
}
