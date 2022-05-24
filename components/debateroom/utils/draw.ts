import { MutableRefObject } from "react";
import Peer from "simple-peer";

import { IDummy } from "./../types";

const drawSquare = (
  canvasRef: MutableRefObject<HTMLCanvasElement | null>,
  color: string,
  dx: number,
  dy: number,
  w: number,
  h: number,
) => {
  const ctx = canvasRef.current?.getContext("2d");
  if (ctx) {
    ctx.fillStyle = color;
    ctx.fillRect(dx, dy, w, h);
  }
};

const drawText = (
  canvasRef: MutableRefObject<HTMLCanvasElement | null>,
  color: string,
  font: string,
  text: string,
  w: number,
  h: number,
) => {
  const ctx = canvasRef.current?.getContext("2d");
  if (ctx) {
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.font = font;
    ctx.fillText(text, w, h);
  }
};

export const draw = (
  canvasRef: MutableRefObject<HTMLCanvasElement | null>,
  peer: Peer.Instance | undefined,
  myVideoRef: MutableRefObject<HTMLVideoElement | null>,
  peerVideoRef: MutableRefObject<HTMLVideoElement | null>,
  isVideoOn: boolean,
  isPeerVideoOn: boolean,
  isScreenOn: boolean,
  isPeerScreenOn: boolean,
  dummy: IDummy,
  isPros: boolean,
  isStart: boolean,
) => {
  // Common Bg
  drawSquare(canvasRef, "#F8FBFD", 0, 80, 1280, 640);

  if (isScreenOn && isPros === dummy.isProsTurn && isStart) {
    //! 내 화면 크게
  } else if (isPeerScreenOn && isPros === dummy.isProsTurn && isStart) {
    //! 상대 화면 크게
  } else {
    drawText(canvasRef, "#292929", "bold 48px san-serif", "VS", 640, 420); // V

    drawSquare(canvasRef, "#ff9425", 40, 110, 520, 520); // prosOuterBg
    drawSquare(canvasRef, "#292929", 50, 120, 500, 500); // prosInnerBg
    drawText(
      canvasRef,
      "#ff9425",
      "bold 32px san-serif",
      `${dummy.prosName}`,
      300,
      680,
    ); // prosName
    drawText(
      canvasRef,
      "#F8FBFD",
      "bold 32px san-serif",
      peer ? "Camera Off" : "Not connected",
      300,
      380,
    ); // prosText

    drawSquare(canvasRef, "#6667ab", 720, 110, 520, 520); // consOuterBg
    drawSquare(canvasRef, "#292929", 730, 120, 500, 500); // consInnerBg
    drawText(
      canvasRef,
      "#6667ab",
      "bold 32px san-serif",
      `${dummy.consName}`,
      980,
      680,
    ); // consName
    drawText(
      canvasRef,
      "#F8FBFD",
      "bold 32px san-serif",
      peer ? "Camera Off" : "Not connected",
      980,
      380,
    ); // consText

    // Video
    if (myVideoRef.current && peerVideoRef.current) {
      const prosVideo = isPros ? myVideoRef.current : peerVideoRef.current;
      const consVideo = isPros ? peerVideoRef.current : myVideoRef.current;
      const IsProsVideoOn = isPros ? isVideoOn : isPeerVideoOn;
      const IsConsVideoOn = isPros ? isPeerVideoOn : isVideoOn;

      if (IsProsVideoOn) {
        canvasRef.current
          ?.getContext("2d")
          ?.drawImage(prosVideo, 50, 120, 500, 500);
      }

      if (IsConsVideoOn) {
        canvasRef.current
          ?.getContext("2d")
          ?.drawImage(consVideo, 730, 120, 500, 500);
      }
    }
  }
};
