import { useEffect } from "react";

import { toggleMic } from "../utils/toggle";
import { offScreenShare } from "../utils/screenShare";

import { IDebateroom } from "./../types";

export const useOffScreenShare = ({
  isPros,
  peerRef,
  stream,
  peerStream,
  videoRef,
  screenStreamRef,
  setIsMicOn,
  setIsScreenOn,
  isPeerScreenOn,
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
  | "turn"
>) => {
  //*- 턴 전환 시 오디오 및 화면 공유 끄기
  useEffect(() => {
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

    offScreenShare({
      peerRef,
      stream,
      videoRef,
      screenStreamRef,
      setIsScreenOn,
    });
  }, [
    isPros,
    peerRef,
    screenStreamRef,
    setIsMicOn,
    setIsScreenOn,
    stream,
    turn,
    videoRef,
  ]);

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
