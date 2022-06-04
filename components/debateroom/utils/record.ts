import { MutableRefObject } from "react";
import { Socket } from "socket.io-client";

export const record = (
  debateId: string | string[] | undefined,
  socket: MutableRefObject<Socket | undefined>,
  canvasRef: MutableRefObject<HTMLCanvasElement | null>,
  mergedAudioTracks: MediaStreamTrack[] | undefined,
  recorderRef: MutableRefObject<MediaRecorder | undefined>,
) => {
  const canvasStream = canvasRef.current?.captureStream(30);
  let mergedTracks: MediaStreamTrack[] | undefined;
  let mergedStream: MediaStream | undefined;

  if (canvasStream && mergedAudioTracks) {
    mergedTracks = canvasStream.getVideoTracks().concat(mergedAudioTracks);
  }

  if (mergedTracks) {
    mergedStream = new MediaStream(mergedTracks);
  }

  if (mergedStream) {
    recorderRef.current = new MediaRecorder(mergedStream, {
      mimeType: "video/webm",
    });
  }

  if (recorderRef.current) {
    recorderRef.current.ondataavailable = (ev) => {
      socket.current?.emit("record", { debateId, data: ev.data });
    };

    recorderRef.current.onstop = () => {
      socket.current?.emit("recordDone", { debateId });
    };
  }
};
