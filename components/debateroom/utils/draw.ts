import { IDebateroom, IDebateData } from "./../types";

const color = {
  white: "#F8FBFD",
  black: "#292929",
  pros: "#ff9425",
  cons: "#6667ab",
};

export const drawContents = ({
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
}: Pick<
  IDebateroom,
  | "isPros"
  | "canvasRef"
  | "peerRef"
  | "videoRef"
  | "peerVideoRef"
  | "isVideoOn"
  | "isPeerVideoOn"
  | "isScreenOn"
  | "isPeerScreenOn"
  | "dummy"
>) => {
  drawSquare({ canvasRef }, color.white, 0, 80, 1280, 640);

  if (isScreenOn) {
    if (!videoRef.current) return;
    drawSquare({ canvasRef }, color.black, 0, 80, 1280, 640);
    const [w, h] = resize(videoRef.current);
    canvasRef.current
      ?.getContext("2d")
      ?.drawImage(videoRef.current, 640 - w / 2, 440 - h / 2, w, h);
  } else if (isPeerScreenOn) {
    if (!peerVideoRef.current) return;
    drawSquare({ canvasRef }, color.black, 0, 80, 1280, 640);
    const [w, h] = resize(peerVideoRef.current);
    canvasRef.current
      ?.getContext("2d")
      ?.drawImage(peerVideoRef.current, 640 - w / 2, 440 - h / 2, w, h);
  } else {
    drawText({ canvasRef }, color.black, "bold 48px san-serif", "VS", 640, 420);

    drawSquare({ canvasRef }, color.pros, 40, 110, 520, 520);
    drawSquare({ canvasRef }, color.black, 50, 120, 500, 500);
    drawText(
      { canvasRef },
      color.pros,
      "bold 32px san-serif",
      `${dummy.prosName}`,
      300,
      680,
    );
    drawText(
      { canvasRef },
      color.white,
      "bold 32px san-serif",
      peerRef.current ? "Camera Off" : isPros ? "Camera Off" : "Not connected",
      300,
      380,
    );

    drawSquare({ canvasRef }, color.cons, 720, 110, 520, 520);
    drawSquare({ canvasRef }, color.black, 730, 120, 500, 500);
    drawText(
      { canvasRef },
      color.cons,
      "bold 32px san-serif",
      `${dummy.consName}`,
      980,
      680,
    );
    drawText(
      { canvasRef },
      color.white,
      "bold 32px san-serif",
      peerRef.current ? "Camera Off" : !isPros ? "Camera Off" : "Not connected",
      980,
      380,
    );

    if (!videoRef.current || !peerVideoRef.current) return;

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
};

export const drawNotice = (
  { canvasRef, turn = "notice" }: Pick<IDebateroom, "canvasRef" | "turn">,
  debateData: IDebateData,
  topic: string,
) => {
  const notice =
    debateData.turn === 0
      ? `${topic} ( ${debateData.timer}초 후 시작 )`
      : debateData.timer >= 1 && debateData.turn !== 7
      ? `${debateData.notice} ( ${debateData.timer}초 )`
      : debateData.notice;
  let bgColor = color.black;
  if (turn === "pros" || turn === "prosCross") bgColor = color.pros;
  if (turn === "cons" || turn === "consCross") bgColor = color.cons;
  drawSquare({ canvasRef }, bgColor, 0, 0, 1280, 80);
  drawText(
    { canvasRef },
    color.white,
    "normal 28px san-serif",
    notice,
    640,
    50,
  );
};

function drawSquare(
  { canvasRef }: Pick<IDebateroom, "canvasRef">,
  color: string,
  dx: number,
  dy: number,
  w: number,
  h: number,
) {
  const ctx = canvasRef.current?.getContext("2d");
  if (!ctx) return;
  ctx.fillStyle = color;
  ctx.fillRect(dx, dy, w, h);
}

function drawText(
  { canvasRef }: Pick<IDebateroom, "canvasRef">,
  color: string,
  font: string,
  text: string,
  w: number,
  h: number,
) {
  const ctx = canvasRef.current?.getContext("2d");
  if (!ctx) return;
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.font = font;
  ctx.fillText(text, w, h);
}

function resize(screen: HTMLVideoElement) {
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
}
