import Image from "next/image";
import { useRouter } from "next/router";
import { useGetUser, useGetUserImage } from "../utils/queries/users";
import styles from "./Header.module.scss";

export default function Header() {
  const user = useGetUser();
  const userImage = useGetUserImage(user.data?.id || "");
  const router = useRouter();
  const handleLogoClick = () => {
    router.push("/");
  };
  const handleProfileClick = () => {
    router.push("/mypage");
  };
  const handleSigninBtnClick = () => {
    router.push("/signin");
  };
  return (
    <div className={styles.container}>
      <div className={styles.logo_container} onClick={handleLogoClick}>
        <Image
          src="/images/logo/debate-ducks-symbol.svg"
          alt="logo_image"
          width="40"
          height="40"
        />
        <h1 className={styles.title}>DEBATE DUCKS</h1>
      </div>
      <div className={styles.profile_container}>
        {userImage.data ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${userImage.data}`}
            alt="profile_image"
            width="30"
            height="30"
            unoptimized={true}
            onClick={handleProfileClick}
          />
        ) : (
          <button className={styles.sign_btn} onClick={handleSigninBtnClick}>
            로그인
          </button>
        )}
      </div>
    </div>
  );
}
