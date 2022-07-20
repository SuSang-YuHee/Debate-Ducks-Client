import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

import DebateRoom from "../../../components/debates/debateroom";

export default function Debateroom() {
  const router = useRouter();
  const { debateId, isPros } = router.query; //! 임시 (isPros)
  const socketRef = useRef<Socket>();

  useEffect(() => {
    socketRef.current = io(`${process.env.NEXT_PUBLIC_API_URL}`);
  }, []);

  return (
    <DebateRoom
      debateId={debateId}
      socket={socketRef}
      isPros={isPros === "true" ? true : false}
    />
  );
}
