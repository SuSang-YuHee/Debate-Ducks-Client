import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

import { useGetUser } from "../../utils/queries/users";
import { useGetDebate } from "../../utils/queries/debates";

import Debateroom from "../../components/debates/debateroom";

export default function DebateroomPage() {
  const router = useRouter();
  const param = router.query;
  const debateId = typeof param?.debateId === "string" ? param?.debateId : "";
  const socketRef = useRef<Socket>(io(`${process.env.NEXT_PUBLIC_API_URL}`));
  const [isPros, setIsPros] = useState<boolean | null>(null);

  const user = useGetUser();
  const debate = useGetDebate(parseInt(debateId), {
    enabled: !!debateId,
  });

  useEffect(() => {
    if (!user.data || !debate.data) return;
    if (debate.data.author_pros) {
      setIsPros(debate.data.author?.id === user.data.id);
    } else {
      setIsPros(debate.data.author?.id !== user.data.id);
    }
  }, [debate.data, user.data]);

  if (
    isPros === null ||
    !user.data ||
    !debate.data ||
    !debate.data.participant ||
    debate.data.video_url
  )
    return <>404</>;
  return (
    <Debateroom
      debateId={debateId}
      socketRef={socketRef}
      debate={debate.data}
      isPros={isPros}
    />
  );
}
