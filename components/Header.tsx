import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import { useGetUser } from "../utils/queries/users";
import styles from "./Header.module.scss";

export default function Header() {
  const user = useGetUser();
  const router = useRouter();
  const [isSigninModalOpen, setIsSigninModalOpen] = useState(false);
  const handleLogoClick = () => {
    router.push("/");
  };
  const handleProfileClick = () => {
    // router.push("/mypage");
    setIsSigninModalOpen(!isSigninModalOpen);
  };
  const handleSigninBtnClick = () => {
    router.push("/signin");
  };
  const handleMyPageClick = () => {
    router.push("/mypage");
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
        {isSigninModalOpen ? (
          <ul className={styles.list}>
            <li className={styles.item} onClick={handleMyPageClick}>
              마이페이지
            </li>
            <li className={styles.item}>로그아웃</li>
          </ul>
        ) : null}
        {user.data ? (
          <Image
            src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${user.data.profile_image}`}
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
