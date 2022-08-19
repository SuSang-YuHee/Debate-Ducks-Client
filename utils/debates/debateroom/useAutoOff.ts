import { useEffect } from "react";

import { toggleMic } from "./toggle";
import { offScreenShare } from "./screenShare";

import { IDebateroom } from "../../../types";

export const useAutoOff = ({
  isPros,
  peerRef,
  streamRef,
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
  | "streamRef"
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
    //* 화면 공유 끄기
    offScreenShare({
      peerRef,
      streamRef,
      videoRef,
      screenStreamRef,
      setIsScreenOn,
    });

    if (turn === "none") return;

    if (isPros) {
      //* 찬성 비디오 끄기/켜기
      if (turn === "pros" || turn === "prosCross") {
        toggleMic({ streamRef, isMicOn: true, setIsMicOn });
      } else {
        toggleMic({ streamRef, isMicOn: false, setIsMicOn });
      }
    } else {
      //* 반대 비디오 끄기/켜기
      if (turn === "cons" || turn === "consCross") {
        toggleMic({ streamRef, isMicOn: true, setIsMicOn });
      } else {
        toggleMic({ streamRef, isMicOn: false, setIsMicOn });
      }
    }
  }, [
    isPros,
    peerRef,
    screenStreamRef,
    setIsMicOn,
    setIsScreenOn,
    streamRef,
    turn,
    videoRef,
    isReady,
  ]); // dependency에 isReady 필요

  //*- 상대 화면 공유 및 재연결 시 화면 공유 끄기
  useEffect(() => {
    if (!isPeerScreenOn) return;
    offScreenShare({
      peerRef,
      streamRef,
      videoRef,
      screenStreamRef,
      setIsScreenOn,
    });
  }, [
    isPeerScreenOn,
    peerRef,
    screenStreamRef,
    setIsScreenOn,
    streamRef,
    videoRef,
  ]); // dependency에 peerStream 필요
};
