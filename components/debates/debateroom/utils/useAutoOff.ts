import { useEffect } from "react";

import { toggleMic } from "./toggle";
import { offScreenShare } from "./screenShare";

import { IDebateroom } from "../types";

export const useAutoOff = ({
  isPros,
  peerRef,
  stream,
  peerStream,
  videoRef,
  screenStreamRef,
  setIsMicOn,
  setIsScreenOn,
  isPeerScreenOn,
  isReady,
  turn,
}: Pick<
  IDebateroom,
  | "isPros"
  | "peerRef"
  | "stream"
  | "peerStream"
  | "videoRef"
  | "screenStreamRef"
  | "setIsMicOn"
  | "setIsScreenOn"
  | "isPeerScreenOn"
  | "isReady"
  | "turn"
>) => {
  //*- 턴 전환 시 오디오 및 화면 공유 끄기
  useEffect(() => {
    offScreenShare({
      peerRef,
      stream,
      videoRef,
      screenStreamRef,
      setIsScreenOn,
    });

    if (turn === "none") return;

    if (isPros) {
      if (turn === "pros" || turn === "prosCross") {
        toggleMic({ stream, isMicOn: true, setIsMicOn });
      } else {
        toggleMic({ stream, isMicOn: false, setIsMicOn });
      }
    } else {
      if (turn === "cons" || turn === "consCross") {
        toggleMic({ stream, isMicOn: true, setIsMicOn });
      } else {
        toggleMic({ stream, isMicOn: false, setIsMicOn });
      }
    }
  }, [
    isPros,
    isReady,
    peerRef,
    screenStreamRef,
    setIsMicOn,
    setIsScreenOn,
    stream,
    turn,
    videoRef,
  ]); // dependency에 isReady 필요

  //*- 상대 화면 공유 및 재연결 시 화면 공유 끄기
  useEffect(() => {
    if (!isPeerScreenOn) return;
    offScreenShare({
      peerRef,
      stream,
      videoRef,
      screenStreamRef,
      setIsScreenOn,
    });
  }, [
    isPeerScreenOn,
    peerRef,
    peerStream,
    screenStreamRef,
    setIsScreenOn,
    stream,
    videoRef,
  ]); // dependency에 peerStream 필요
};
