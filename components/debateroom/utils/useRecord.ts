import { useEffect } from "react";

import { IDebateroom } from "../types";

export const useRecord = ({
  canvasRef,
  stream,
  peerStream,
  isStart,
  mergedAudio,
  setMergedAudio,
  recorderRef,
  reRecord,
  setReRecord,
  blobsRef,
}: Pick<
  IDebateroom,
  | "canvasRef"
  | "stream"
  | "peerStream"
  | "isStart"
  | "mergedAudio"
  | "setMergedAudio"
  | "recorderRef"
  | "reRecord"
  | "setReRecord"
  | "blobsRef"
>) => {
  useEffect(() => {
    mergeAudio({ stream, peerStream, setMergedAudio });
  }, [peerStream, setMergedAudio, stream]);

  useEffect(() => {
    record({ canvasRef, mergedAudio, recorderRef, setReRecord, blobsRef });
  }, [mergedAudio, canvasRef, recorderRef, blobsRef, setReRecord]);

  useEffect(() => {
    if (!isStart || recorderRef.current?.state === "recording") return;
    recorderRef.current?.start(1000 / 30);
  }, [isStart, recorderRef, reRecord]); // dependency에 reRecord 필요
};

function mergeAudio({
  stream,
  peerStream,
  setMergedAudio,
}: Pick<IDebateroom, "stream" | "peerStream" | "setMergedAudio">) {
  const merge = ({
    stream,
    peerStream,
  }: Pick<IDebateroom, "stream" | "peerStream">) => {
    if (stream && peerStream) {
      const ctx = new AudioContext();
      const destination = ctx.createMediaStreamDestination();

      const source1 = ctx.createMediaStreamSource(stream);
      const source1Gain = ctx.createGain();
      source1.connect(source1Gain).connect(destination);

      const source2 = ctx.createMediaStreamSource(peerStream);
      const source2Gain = ctx.createGain();
      source2.connect(source2Gain).connect(destination);

      return destination.stream.getAudioTracks();
    }

    if (stream) {
      const ctx = new AudioContext();
      const destination = ctx.createMediaStreamDestination();

      const source = ctx.createMediaStreamSource(stream);
      const sourceGain = ctx.createGain();
      source.connect(sourceGain).connect(destination);

      return destination.stream.getAudioTracks();
    }
  };

  setMergedAudio(merge({ stream, peerStream }));
}

function record({
  canvasRef,
  mergedAudio,
  recorderRef,
  setReRecord,
  blobsRef,
}: Pick<
  IDebateroom,
  "canvasRef" | "mergedAudio" | "recorderRef" | "setReRecord" | "blobsRef"
>) {
  const canvasStream = canvasRef.current?.captureStream(30);

  if (!canvasStream || !mergedAudio) return;
  const mergedTracks = canvasStream.getVideoTracks().concat(mergedAudio);

  if (!mergedTracks) return;
  const mergedStream = new MediaStream(mergedTracks);

  if (!mergedStream) return;
  const recorder = new MediaRecorder(mergedStream, {
    mimeType: "video/webm",
  });

  if (!recorder) return;
  if (recorderRef.current?.state === "recording") {
    recorderRef.current?.stop();
  }
  recorderRef.current = recorder;
  recorderRef.current.ondataavailable = (ev) => {
    blobsRef.current?.push(ev.data);
  };
  setReRecord((state) => !state);
}
