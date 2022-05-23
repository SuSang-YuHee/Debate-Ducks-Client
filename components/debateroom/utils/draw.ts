import { MutableRefObject } from "react";

export const drawVideo = (
  canvasRef: MutableRefObject<HTMLCanvasElement | null>,
  myVideoRef: MutableRefObject<HTMLVideoElement | null>,
  peerVideoRef: MutableRefObject<HTMLVideoElement | null>,
  dummy: {
    isPros: boolean;
    isProsTurn: boolean;
    prosName: string;
    consName: string;
  },
) => {
  const BgCtx = canvasRef.current?.getContext("2d");
  if (BgCtx) {
    BgCtx.fillStyle = "#F8FBFD";
    BgCtx.fillRect(0, 80, 1280, 640);
  }

  const prosBgCtx = canvasRef.current?.getContext("2d");
  if (prosBgCtx) {
    prosBgCtx.fillStyle = "#ff9425";
    prosBgCtx.fillRect(10, 90, 520, 520);
  }
  const prosTextCtx = canvasRef.current?.getContext("2d");
  if (prosTextCtx) {
    prosTextCtx.font = "bold 32px san-serif";
    prosTextCtx.fillStyle = "#ff9425";
    prosTextCtx.textAlign = "center";
    prosTextCtx.fillText(`${dummy.prosName}`, 320, 680);
  }

  // const consBgCtx = canvasRef.current?.getContext("2d");
  // if (consBgCtx) {
  //   consBgCtx.fillStyle = "#ff9425";
  //   consBgCtx.fillRect(10, 90, 520, 520);
  // }
  // const consTextCtx = canvasRef.current?.getContext("2d");
  // if (consTextCtx) {
  //   consTextCtx.font = "32px";
  //   consTextCtx.fillStyle = "#ff9425";
  //   consTextCtx.textAlign = "center";
  //   consTextCtx.fillText(`${dummy.consName}`, 320, 620);
  // }

  if (myVideoRef.current && peerVideoRef.current) {
    const prosVideo = dummy.isPros ? myVideoRef.current : peerVideoRef.current;
    const consVideo = dummy.isPros ? peerVideoRef.current : myVideoRef.current;

    canvasRef.current
      ?.getContext("2d")
      ?.drawImage(prosVideo, 20, 100, 500, 500);
    canvasRef.current
      ?.getContext("2d")
      ?.drawImage(consVideo, 660, 100, 500, 500);
  }
};

// export const drawProsScreen = (canvasRef, myVideoRef, peerVideoRef) => {};

// export const drawConsScreen = (canvasRef, myVideoRef, peerVideoRef) => {};
