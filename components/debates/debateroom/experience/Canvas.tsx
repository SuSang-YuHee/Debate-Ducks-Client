import { useEffect } from "react";

import { drawContents } from "../../../../utils/debates/debateroom/draw";
import { useSetInterval } from "../../../../utils/debates/debateroom/useSetInterval";
import styles from "../Canvas.module.scss";

import { IDebateroom } from "../../../../types";

export default function Canvas({
  debate,
  canvasRef,
  streamRef,
  videoRef,
  isVideoOn,
  isScreenOn,
}: Pick<
  IDebateroom,
  "debate" | "canvasRef" | "streamRef" | "videoRef" | "isVideoOn" | "isScreenOn"
>) {
  const [drawStart, drawStop] = useSetInterval(
    () =>
      drawContents({
        debate,
        isPros: true,
        canvasRef,
        peerStream: streamRef.current,
        videoRef,
        peerVideoRef: videoRef,
        isVideoOn,
        isPeerVideoOn: false,
        isScreenOn,
        isPeerScreenOn: false,
      }),
    1000 / 30,
  );

  useEffect(() => {
    drawStop();
    drawStart();
  }, [drawStart, drawStop, isVideoOn, isScreenOn]); // dependency에 isVideoOn, isScreenOn 필요

  return (
    <canvas
      className={styles.canvas}
      ref={canvasRef}
      width="1280px"
      height="720px"
    ></canvas>
  );
}
