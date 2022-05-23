import { useEffect } from "react";
import { Socket } from "socket.io-client";

interface IRoom {
  debateId: string | string[] | undefined;
  socket: Socket | undefined;
}

export default function Room({ debateId, socket }: IRoom) {
  useEffect(() => {
    socket?.on("connect", () => {
      socket.emit("join", debateId);
      console.log("connect", socket.id);
    });

    socket?.on("overcapacity", () => {
      console.log("overcapacity");
    });

    socket?.on("guestJoin", () => {
      console.log("room", debateId);
    });
  }, [debateId, socket]);

  return (
    <div>
      <h1>Room</h1>
    </div>
  );
}
