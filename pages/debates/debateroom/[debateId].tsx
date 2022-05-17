import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function Debateroom() {
  const router = useRouter();
  const { debateId } = router.query;
  const [socket, setSocket] = useState({});

  useEffect(() => {
    setSocket(io(`${process.env.NEXT_PUBLIC_API_URL}`));
  }, []);

  console.log(socket);

  return (
    <div>
      <h1>Debateroom: {debateId}</h1>
    </div>
  );
}
