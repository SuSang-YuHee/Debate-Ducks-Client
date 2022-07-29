import Image from "next/image";
import { useGetUser, useGetUserImage } from "../utils/queries/users";

export default function Header() {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("debate-ducks-token")
      : null;
  const user = useGetUser(token || "");
  // console.log(user.data?.id);
  const userImage = useGetUserImage(user.data?.id || "");
  console.log(userImage.data);
  return (
    <div>
      <h1>DEBATE DUCKS</h1>
      {userImage.data ? (
        <Image
          src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${userImage.data}`}
          alt="profile_image"
          width="300"
          height="300"
          unoptimized={true}
        />
      ) : null}
    </div>
  );
}
