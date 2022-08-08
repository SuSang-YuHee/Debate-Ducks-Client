import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import styles from "./Signin.module.scss";

export default function Signin() {
  const [userInfo, setUserInfo] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const router = useRouter();

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    const valueType = e.target.name;
    const value = e.target.value;
    setUserInfo({ ...userInfo, [valueType]: value });
  }

  function handleSignin() {
    console.log(userInfo);
    axios
      .post("http://localhost:80/users/login", userInfo, {
        validateStatus: (status) => status < 500,
      })
      .then((res) => {
        if (res.data.statusCode === 404) {
          alert(
            "이메일 혹은 비밀번호가 일치하지 않습니다. 입력한 내용을 확인해주세요.",
          );
        } else {
          console.log(res);
          localStorage.setItem("debate-ducks-token", res.data);
          router.push("/");
        }
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
          <input id="email" name="email" type="text" onChange={handleChange} />
        </div>
        <div className={styles.password}>
          <label htmlFor="password">비밀번호</label>
          {showPassword ? (
            <div className={styles.wrapper}>
              <input
                id="password"
                name="password"
                type="text"
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
                onChange={handleChange}
              />
              <span onClick={togglePassword} className={styles.show}>
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </span>
            </div>
          )}
        </div>
        <button onClick={handleSignin} className={styles.btn}>
          로그인
        </button>
        <div className={styles.signup}>
          <div>아직 회원이 아니신가요?</div>
          <Link href="/signup">
            <div>회원 가입하기</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
