import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useQueryClient } from "react-query";

import { login } from "../../api/users";
import { queryStr } from "../../utils/queries";
import styles from "./Signin.module.scss";

export default function Signin() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [userInfo, setUserInfo] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const valueType = e.target.name;
    const value = e.target.value;
    setUserInfo({ ...userInfo, [valueType]: value });
  }

  function handleSignin() {
    login(userInfo.email, userInfo.password, () => {
      queryClient.invalidateQueries([queryStr.users]);
      const storage = globalThis?.sessionStorage;
      const link =
        storage.getItem("prevPath") === "/signin" ||
        storage.getItem("prevPath") === "/signup"
          ? "/"
          : storage.getItem("prevPath") || "/";
      router.push(link);
    });
  }

  function togglePassword() {
    setShowPassword(!showPassword);
  }
  return (
    <div className={styles.outer}>
      <div className={styles.container}>
        <h1 className={styles.title}>로그인</h1>
        <div className={styles.email}>
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            name="email"
            type="text"
            placeholder="이메일을 입력하세요"
            onChange={handleChange}
          />
        </div>
        <div className={styles.password}>
          <label htmlFor="password">비밀번호</label>
          {showPassword ? (
            <div className={styles.wrapper}>
              <input
                id="password"
                name="password"
                type="text"
                placeholder="비밀번호를 입력하세요"
                onChange={handleChange}
              />
              <span onClick={togglePassword} className={styles.show}>
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
          ) : (
            <div className={styles.wrapper}>
              <input
                id="password"
                name="password"
                type="password"
                placeholder="비밀번호를 입력하세요"
                onChange={handleChange}
              />
              <span onClick={togglePassword} className={styles.show}>
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
          )}
        </div>
        {userInfo.email.length === 0 || userInfo.password.length === 0 ? (
          <button className={`${styles.btn} ${styles.invalid}`}>로그인</button>
        ) : (
          <button onClick={handleSignin} className={styles.btn}>
            로그인
          </button>
        )}
        <div className={styles.signup}>
          <div>아직 회원이 아니신가요?</div>
          <div
            onClick={() => {
              router.push("/signup");
            }}
          >
            <div>회원 가입하기</div>
          </div>
        </div>
      </div>
    </div>
  );
}
