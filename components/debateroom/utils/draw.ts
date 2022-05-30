import { MutableRefObject } from "react";
import Peer from "simple-peer";

import { IDummy } from "./../types";

interface IColor {
  [index: string]: string;
}

export interface IDebateData {
  notice: string;
  turn: number;
  timer: number;
}

const color: IColor = {
  white: "#F8FBFD",
  black: "#292929",
  pros: "#ff9425",
  cons: "#6667ab",
};

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

const resize = (screen: HTMLVideoElement) => {
  let w = 0;
  let h = 0;

  if (screen.videoWidth >= screen.videoHeight) {
    w = 1280;
    h = (1280 * screen.videoHeight) / screen.videoWidth;
    if (h > 720) {
      w = (1280 * 720) / h;
      h = 720;
    }
  } else {
    w = (720 * screen.videoWidth) / screen.videoHeight;
    h = 720;
  }

  return [w, h];
};

//*- 내용 그리기
export const drawContents = (
  canvasRef: MutableRefObject<HTMLCanvasElement | null>,
  peer: Peer.Instance | undefined,
  videoRef: MutableRefObject<HTMLVideoElement | null>,
  peerVideoRef: MutableRefObject<HTMLVideoElement | null>,
  isVideoOn: boolean,
  isPeerVideoOn: boolean,
  isScreenOn: boolean,
  isPeerScreenOn: boolean,
  dummy: IDummy,
  isPros: boolean,
  // turn: "notice" | "pros" | "cons" | "prosCross" | "consCross",
) => {
  // * Common Bg
  drawSquare(canvasRef, color.white, 0, 80, 1280, 640);

  // * My screen share
  if (isScreenOn) {
    if (videoRef.current) {
      drawSquare(canvasRef, color.black, 0, 80, 1280, 640);
      const [w, h] = resize(videoRef.current);
      canvasRef.current
        ?.getContext("2d")
        ?.drawImage(videoRef.current, 640 - w / 2, 440 - h / 2, w, h);
    }
    // * Peer screen share
  } else if (isPeerScreenOn) {
    if (peerVideoRef.current) {
      drawSquare(canvasRef, color.black, 0, 80, 1280, 640);
      const [w, h] = resize(peerVideoRef.current);
      canvasRef.current
        ?.getContext("2d")
        ?.drawImage(peerVideoRef.current, 640 - w / 2, 440 - h / 2, w, h);
    }
  } else {
    // * VS
    drawText(canvasRef, color.black, "bold 48px san-serif", "VS", 640, 420);

    // * pros draw
    drawSquare(canvasRef, color.pros, 40, 110, 520, 520);
    drawSquare(canvasRef, color.black, 50, 120, 500, 500);
    drawText(
      canvasRef,
      color.pros,
      "bold 32px san-serif",
      `${dummy.prosName}`,
      300,
      680,
    );
    drawText(
      canvasRef,
      color.white,
      "bold 32px san-serif",
      peer ? "Camera Off" : isPros ? "Camera Off" : "Not connected",
      300,
      380,
    );

    // * cons draw
    drawSquare(canvasRef, color.cons, 720, 110, 520, 520);
    drawSquare(canvasRef, color.black, 730, 120, 500, 500);
    drawText(
      canvasRef,
      color.cons,
      "bold 32px san-serif",
      `${dummy.consName}`,
      980,
      680,
    );
    drawText(
      canvasRef,
      color.white,
      "bold 32px san-serif",
      peer ? "Camera Off" : !isPros ? "Camera Off" : "Not connected",
      980,
      380,
    );

    // * Video
    if (videoRef.current && peerVideoRef.current) {
      const prosVideo = isPros ? videoRef.current : peerVideoRef.current;
      const consVideo = isPros ? peerVideoRef.current : videoRef.current;
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

//*- 공지 그리기
export const drawNotice = (
  canvasRef: MutableRefObject<HTMLCanvasElement | null>,
  debateData: IDebateData,
  topic: string,
  turn: string,
) => {
  const notice =
    debateData.turn === 0
      ? `${topic} ( ${debateData.timer}초 후 시작 )`
      : debateData.timer < 0
      ? debateData.notice
      : `${debateData.notice} ( ${debateData.timer}초 )`;
  let bgColor = color.black;
  if (turn === "pros" || turn === "prosCross") bgColor = color.pros;
  if (turn === "cons" || turn === "consCross") bgColor = color.cons;
  drawSquare(canvasRef, bgColor, 0, 0, 1280, 80);
  drawText(canvasRef, color.white, "normal 28px san-serif", notice, 640, 50);
};
