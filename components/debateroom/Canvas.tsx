import { useRef, useEffect } from "react";

import { draw } from "../debateroom/utils/draw";
import { useSetInterval } from "../debateroom/utils/useSetInterval";

import { IDebateroomProps } from "./types";

export default function Canvas({
  peer,
  recorderRef,
  downRef,
  videoRef,
  peerVideoRef,
  isVideoOn,
  isPeerVideoOn,
  isScreenOn,
  isPeerScreenOn,
  dummy,
  isPros,
}: Pick<
  IDebateroomProps,
  | "peer"
  | "recorderRef"
  | "downRef"
  | "videoRef"
  | "peerVideoRef"
  | "isVideoOn"
  | "isPeerVideoOn"
  | "isScreenOn"
  | "isPeerScreenOn"
  | "dummy"
  | "isPros"
>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blobsRef = useRef<Blob[]>([]);
  const [drawStart, drawStop] = useSetInterval(
    () =>
      draw(
        canvasRef,
        peer,
        videoRef,
        peerVideoRef,
        isVideoOn,
        isPeerVideoOn,
        isScreenOn,
        isPeerScreenOn,
        dummy,
        isPros,
      ),
    1000 / 30,
  );

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
  }, [recorderRef, downRef]);

  useEffect(() => {
    drawStop();
    drawStart();
  }, [
    drawStart,
    drawStop,
    peer,
    isVideoOn,
    isPeerVideoOn,
    isScreenOn,
    isPeerScreenOn,
  ]);

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
