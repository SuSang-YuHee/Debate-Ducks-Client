import { useEffect } from "react";

import { drawContents } from "../../../utils/debates/debateroom/draw";
import { useSetInterval } from "../../../utils/debates/debateroom/useSetInterval";

import { IDebateroom } from "../../../types";

export default function Canvas({
  debate,
  isPros,
  canvasRef,
  peerStream,
  videoRef,
  peerVideoRef,
  isVideoOn,
  isPeerVideoOn,
  isScreenOn,
  isPeerScreenOn,
}: Pick<
  IDebateroom,
  | "debate"
  | "isPros"
  | "canvasRef"
  | "peerStream"
  | "videoRef"
  | "peerVideoRef"
  | "isVideoOn"
  | "isPeerVideoOn"
  | "isScreenOn"
  | "isPeerScreenOn"
>) {
  const [drawStart, drawStop] = useSetInterval(
    () =>
      drawContents({
        debate,
        isPros,
        canvasRef,
        peerStream,
        videoRef,
        peerVideoRef,
        isVideoOn,
        isPeerVideoOn,
        isScreenOn,
        isPeerScreenOn,
      }),
    1000 / 30,
  );

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
        style={{ border: "2px solid red", width: "100vw" }} //! 임시
      ></canvas>
    </div>
  );
}
