import Image from "next/image";
import { useGetUser } from "../../utils/queries/users";
import styles from "../../styles/MyPage.module.scss";

export default function MyPage() {
  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("debate-ducks-token")
      : null;
  const user = useGetUser(token || "");
  console.log(user);
  return (
    <div className={styles.container}>
      {user.data ? (
        <Image
          className={styles.image}
          alt="profile_image"
          src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${user.data?.profile_image}`}
          width="300"
          height="300"
          unoptimized={true}
        />
      ) : null}
      {user.data ? <div>{user.data.nickname}</div> : null}
      {user.data ? <div>{user.data.email}</div> : null}
    </div>
  );
}
