import { useRouter } from "next/router";

export default function Debateroom() {
  const router = useRouter();
  const { debateId } = router.query;

  return (
    <div>
      <h1>Debateroom: {debateId}</h1>
    </div>
  );
}
