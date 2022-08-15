import Image from "next/image";
import { useRouter } from "next/router";
import { useState } from "react";
import toast from "react-hot-toast";
import { useQueryClient } from "react-query";

import { useGetUser } from "../utils/queries/users";
import { queryStr } from "../utils/queries";
import styles from "./Header.module.scss";

import ConfirmModal from "./common/modal/ConfirmModal";

export default function Header() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [isSigninModalOpen, setIsSigninModalOpen] = useState(false);
  const [isSignoutModalOpen, setIsSignoutModalOpen] = useState(false);

  const user = useGetUser();

  const handleLogoClick = () => {
    router.push("/");
  };

  const handleProfileClick = () => {
    setIsSigninModalOpen(!isSigninModalOpen);
  };

  const handleSigninBtnClick = () => {
    router.push("/signin");
  };

  const handleMyPageClick = () => {
    router.push("/mypage");
    setIsSigninModalOpen(false);
  };

  return /\/debateroom/.test(router.pathname) ? null : (
    <div className={styles.container}>
      {isSignoutModalOpen ? (
        <ConfirmModal
          title="다음에 또 봐요! 👋"
          content="로그아웃 하시겠습니까?"
          firstBtn="머무르기"
          firstFunc={() => {
            setIsSignoutModalOpen(false);
          }}
          secondBtn={"로그아웃"}
          secondFunc={() => {
            setIsSignoutModalOpen(false);
            window.localStorage.removeItem("debate-ducks-token");
            queryClient.setQueryData([queryStr.users], () => null);
            toast.success("로그아웃 되었습니다!");
          }}
        />
      ) : null}
      {isSigninModalOpen ? (
        <div
          className={styles.background}
          onClick={() => {
            setIsSigninModalOpen(false);
          }}
        ></div>
      ) : null}
      <div className={styles.logo_container} onClick={handleLogoClick}>
        <div className={styles.image}>
          <Image
            src="/images/logo/debate-ducks-symbol.svg"
            alt="logo_image"
            width="40"
            height="40"
          />
        </div>
        <h1 className={styles.title}>DEBATE DUCKS</h1>
      </div>
      <div className={styles.profile_container}>
        {isSigninModalOpen ? (
          <ul className={styles.list}>
            <li className={styles.item} onClick={handleMyPageClick}>
              마이페이지
            </li>
            <li
              className={styles.item}
              onClick={() => {
                setIsSignoutModalOpen(true);
                setIsSigninModalOpen(false);
              }}
            >
              로그아웃
            </li>
          </ul>
        ) : null}
        {user.data ? (
          <>
            <div
              className={styles.sign_btn_cut}
              onClick={() => {
                router.push("/q&a");
              }}
            >
              ?
            </div>
            <div className={styles.image_box}>
              <Image
                src={
                  user.data?.profile_image !== "temp default image"
                    ? `${process.env.NEXT_PUBLIC_API_URL}/uploads/${user.data?.profile_image}`
                    : "/images/profiles/default-green.png"
                }
                alt="profile_image"
                width="30"
                height="30"
                unoptimized={true}
                onClick={handleProfileClick}
              />
            </div>
          </>
        ) : (
          <>
            <div
              className={styles.sign_btn}
              onClick={() => {
                router.push("/q&a");
              }}
            >
              {"Q & A"}
            </div>
            <div className={styles.sign_btn} onClick={handleSigninBtnClick}>
              로그인
            </div>
          </>
        )}
      </div>
    </div>
  );
}
