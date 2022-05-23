import { useRef, useEffect } from "react";

import { drawVideo } from "../debateroom/utils/draw";
import { useSetInterval } from "../debateroom/utils/useSetInterval";

import { IDebateroomProps } from "./types";

export default function Canvas({
  recorderRef,
  downRef,
  videoRef,
  peerVideoRef,
  dummy,
}: Pick<
  IDebateroomProps,
  "recorderRef" | "downRef" | "videoRef" | "peerVideoRef" | "dummy"
>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blobsRef = useRef<Blob[]>([]);
  const [drawVideoStart] = useSetInterval(
    () => drawVideo(canvasRef, videoRef, peerVideoRef, dummy),
    1000 / 30,
  );
  // const [drawProsStart, drawProsStop] = useSetInterval(() => drawPros(), 1000 / 30);
  // const [drawConsStart, drawConsStop] = useSetInterval(() => drawCons(), 1000 / 30);

  useEffect(() => {
    let mergedTracks, mergedStream, blob, url;
    const canvasStream = canvasRef.current?.captureStream(30);
    if (canvasStream) mergedTracks = [...canvasStream?.getVideoTracks()];
    if (mergedTracks) mergedStream = new MediaStream(mergedTracks);
    if (mergedStream) {
      recorderRef.current = new MediaRecorder(mergedStream, {
        mimeType: "video/webm",
      });
    }
    if (recorderRef.current) {
      recorderRef.current.ondataavailable = (ev) => {
        blobsRef.current = [...blobsRef.current, ev.data];
      };

      recorderRef.current.onstop = async () => {
        blob = new Blob(blobsRef.current, { type: "video/webm" });
        url = window.URL.createObjectURL(blob);
        if (downRef.current) downRef.current.href = url;
      };
    }

    console.log(recorderRef.current); //*
  }, [recorderRef, downRef]);

  useEffect(() => {
    drawVideoStart();
  });

  return (
    <div>
      <h1>Canvas</h1>
      <canvas
        ref={canvasRef}
        width="1280px"
        height="720px"
        style={{ border: "2px solid red", width: "100vw" }}
      ></canvas>
    </div>
  );
}
