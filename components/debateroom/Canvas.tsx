import { useRef, useEffect, MutableRefObject } from "react";

interface ICanvasProps {
  recorderRef: MutableRefObject<MediaRecorder | undefined>;
  downRef: MutableRefObject<HTMLAnchorElement | null>;
}

export default function Canvas({ recorderRef, downRef }: ICanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blobsRef = useRef<Blob[]>([]);

  useEffect(() => {
    let mergedTracks, mergedStream, blob, url;
    const canvasStream = canvasRef.current?.captureStream(30);
    if (canvasStream) mergedTracks = [...canvasStream?.getVideoTracks()];
    if (mergedTracks) mergedStream = new MediaStream(mergedTracks);
    if (mergedStream) {
      recorderRef.current = new MediaRecorder(mergedStream, {
        mimeType: "video/webm",
      });
    }
    if (recorderRef.current) {
      recorderRef.current.ondataavailable = (ev) => {
        blobsRef.current = [...blobsRef.current, ev.data];
      };

      recorderRef.current.onstop = async () => {
        blob = new Blob(blobsRef.current, { type: "video/webm" });
        url = window.URL.createObjectURL(blob);
        if (downRef.current) downRef.current.href = url;
      };
    }

    console.log(recorderRef.current); //*

    const EraserCtx = canvasRef.current?.getContext("2d");
    if (EraserCtx) {
      EraserCtx.fillStyle = "red";
      EraserCtx.fillRect(0, 0, 1280, 100);
    }
  }, [recorderRef, downRef]);

  return (
    <div>
      <h1>Canvas</h1>
      <canvas
        ref={canvasRef}
        width="1280px"
        height="720px"
        style={{ border: "2px solid red", width: "100vw", height: "100wh" }}
      ></canvas>
    </div>
  );
}
