import { useEffect } from "react";

import { IDebateroom } from "../../types";

export const useSetRecorder = ({
  debateId,
  socket,
  isHost,
  canvasRef,
  stream,
  peerStream,
  isStart,
  mergedAudioRef,
  recorderRef,
}: Pick<
  IDebateroom,
  | "debateId"
  | "socket"
  | "isHost"
  | "canvasRef"
  | "stream"
  | "peerStream"
  | "isStart"
  | "mergedAudioRef"
  | "recorderRef"
>) => {
  useEffect(() => {
    if (!isHost || !isStart) return;
    mergeAudio({ stream, peerStream, mergedAudioRef });
    setRecorder({
      debateId,
      socket,
      canvasRef,
      mergedAudioRef,
      recorderRef,
    });
    if (recorderRef.current && recorderRef.current?.state !== "recording") {
      recorderRef.current?.start(1000 / 30);
      console.log("녹화 시작"); //! console
    }
  }, [
    stream,
    peerStream,
    mergedAudioRef,
    canvasRef,
    recorderRef,
    isStart,
    isHost,
    socket,
    debateId,
  ]);
};

//*- utils
function mergeAudio({
  stream,
  peerStream,
  mergedAudioRef,
}: Pick<IDebateroom, "stream" | "peerStream" | "mergedAudioRef">) {
  const merge = ({
    stream,
    peerStream,
  }: Pick<IDebateroom, "stream" | "peerStream">) => {
    if (!stream || !peerStream) return;

    const ctx = new AudioContext();
    const destination = ctx.createMediaStreamDestination();

    const source1 = ctx.createMediaStreamSource(stream);
    const source1Gain = ctx.createGain();
    source1.connect(source1Gain).connect(destination);

    const source2 = ctx.createMediaStreamSource(peerStream);
    const source2Gain = ctx.createGain();
    source2.connect(source2Gain).connect(destination);

    return destination.stream.getAudioTracks();
  };

  mergedAudioRef.current = merge({ stream, peerStream });
}

function setRecorder({
  debateId,
  socket,
  canvasRef,
  mergedAudioRef,
  recorderRef,
}: Pick<
  IDebateroom,
  "debateId" | "socket" | "canvasRef" | "mergedAudioRef" | "recorderRef"
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
    socket.current?.emit("record", { debateId, blob: ev.data });
  };
}
