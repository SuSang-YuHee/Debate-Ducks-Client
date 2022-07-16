import { IDebateroom } from "../types";

export const upload = (
  isUploader: boolean,
  {
    socket,
    debateId,
    blobRef,
  }: Pick<IDebateroom, "socket" | "debateId" | "blobRef">,
) => {
  //Todo: 업로드 기능
  if (isUploader) {
    socket.current?.emit("debateDone", { debateId });
    console.log("임시 업로드", blobRef.current);
  }
};
