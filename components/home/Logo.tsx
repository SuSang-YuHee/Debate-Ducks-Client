import Image from "next/image";
export default function Logo() {
  return (
    <>
      <Image
        src="/debate-ducks-symbol.svg"
        alt="logo image"
        width={60}
        height={60}
      />
      <h1>DEBATE DUCKS</h1>
    </>
  );
}
