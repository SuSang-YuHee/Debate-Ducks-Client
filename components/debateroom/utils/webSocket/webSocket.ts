import { IDebateroom } from "../../types";

export const wsTransmitSkip = ({
  debateId,
  socket,
  isPros,
}: Pick<IDebateroom, "debateId" | "socket" | "isPros">) => {
  socket.current?.emit("skip", { debateId, isPros });
};
