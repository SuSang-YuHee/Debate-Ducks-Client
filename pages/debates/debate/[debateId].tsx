import { useRouter } from "next/router";

export default function Debate() {
  const router = useRouter();
  const { debateId } = router.query;

  return (
    <div>
      <h1>Debate: {debateId}</h1>
    </div>
  );
}
