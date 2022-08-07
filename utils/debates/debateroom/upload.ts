import { IDebateroom } from "../../../types";

export const upload = ({
  socketRef,
  debateId,
  blobRef,
}: Pick<IDebateroom, "socketRef" | "debateId" | "blobRef">) => {
  //Todo: 업로드 기능, 한명만 올리는 구분 서버로부터
  socketRef.current.emit("debateDone", { debateId });
  console.log("임시 업로드", blobRef.current);
};
