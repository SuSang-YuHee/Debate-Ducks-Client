import { useEffect } from "react";

import { drawContents } from "../debateroom/utils/draw";
import { useSetInterval } from "../debateroom/utils/useSetInterval";

import { IDebateroomProps } from "./types";

export default function Canvas({
  isPros,
  peerRef,
  canvasRef,
  videoRef,
  peerVideoRef,
  isVideoOn,
  isPeerVideoOn,
  isScreenOn,
  isPeerScreenOn,
  dummy,
}: Pick<
  IDebateroomProps,
  | "isPros"
  | "peerRef"
  | "canvasRef"
  | "videoRef"
  | "peerVideoRef"
  | "isVideoOn"
  | "isPeerVideoOn"
  | "isScreenOn"
  | "isPeerScreenOn"
  | "dummy"
>) {
  const [drawStart, drawStop] = useSetInterval(
    () =>
      drawContents(
        isPros,
        canvasRef,
        peerRef,
        videoRef,
        peerVideoRef,
        isVideoOn,
        isPeerVideoOn,
        isScreenOn,
        isPeerScreenOn,
        dummy,
      ),
    1000 / 30,
  );

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
