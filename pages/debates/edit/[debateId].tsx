import { useRouter } from "next/router";

export default function Edit() {
  const router = useRouter();
  const { debateId } = router.query;

  return (
    <div>
      <h1>Edit: {debateId}</h1>
    </div>
  );
}
