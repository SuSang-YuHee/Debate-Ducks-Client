import { useRef, useEffect } from "react";

import { drawContents } from "../debateroom/utils/draw";
import { useSetInterval } from "../debateroom/utils/useSetInterval";

import { IDebateroomProps } from "./types";

export default function Canvas({
  peerRef,
  canvasRef,
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
  | "peerRef"
  | "canvasRef"
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
  const [drawStart, drawStop] = useSetInterval(
    () =>
      drawContents(
        canvasRef,
        peerRef,
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
  const blobsRef = useRef<Blob[]>([]);

  //*- 내용 표시
  useEffect(() => {
    drawStop();
    drawStart();
  }, [
    drawStart,
    drawStop,
    isVideoOn,
    isPeerVideoOn,
    isScreenOn,
    isPeerScreenOn,
  ]);

  //*- 녹화
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
  }, [canvasRef, recorderRef, downRef]);

  return (
    <div>
      <h1>Canvas</h1>
      <canvas
        ref={canvasRef}
        width="1280px"
        height="720px"
        style={{ border: "2px solid red", width: "100vw" }} //!
      ></canvas>
    </div>
  );
}
