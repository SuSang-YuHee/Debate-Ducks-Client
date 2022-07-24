import axios from "axios";
import { useRouter } from "next/router";
import { BaseSyntheticEvent, useRef, useState } from "react";
import styles from "../../styles/Signup.module.scss";

axios.defaults.withCredentials = true;

interface IUserInfo {
  name: string | undefined;
  email: string | undefined;
  password: string | undefined;
}

export default function Signup() {
  const [userInfo, setUserInfo] = useState<IUserInfo>({
    name: "",
    email: "",
    password: "",
  });
  const [isValidName, setIsValidName] = useState<boolean>(true);
  const [isValidEmail, setIsValidEmail] = useState<boolean>(true);
  const [isValidPassword, setIsValidPassword] = useState<boolean>(true);
  const [isPwIncludesName, setIsPwIncludesName] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  const router = useRouter();

  const emailRegExp =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
  const passwordRegExp =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@!%*#?&])[A-Za-z\d@!%*#?&]{8,}$/i;

  function handleChange(e: BaseSyntheticEvent) {
    const value = e.target.value;
    const valueType = e.target.name;
    if (valueType === "name") {
      if (value.length >= 3 && value.length <= 30) {
        setIsValidName(true);
        setUserInfo({ ...userInfo, [valueType]: value });
      } else {
        setIsValidName(false);
        setUserInfo({ ...userInfo, [valueType]: "" });
      }
    } else if (valueType === "email") {
      if (value.match(emailRegExp) !== null) {
        setIsValidEmail(true);
        setUserInfo({ ...userInfo, [valueType]: value });
      } else {
        setIsValidEmail(false);
        setUserInfo({ ...userInfo, [valueType]: "" });
      }
    } else if (valueType === "password") {
      if (value.match(passwordRegExp) !== null) {
        if (!value.includes(userInfo.name)) {
          setIsValidPassword(true);
          setIsPwIncludesName(false);
          setUserInfo({ ...userInfo, [valueType]: value });
        } else {
          setIsValidPassword(true);
          setIsPwIncludesName(true);
          setUserInfo({ ...userInfo, [valueType]: "" });
        }
      } else {
        setIsValidPassword(false);
        setIsPwIncludesName(false);
        setUserInfo({ ...userInfo, [valueType]: "" });
      }
    }
  }
  function handleSignup() {
    console.log(userInfo);
    axios.post("http://localhost:80/users", userInfo).then((res) => {
      if (res.statusText === "Created") {
        router.push("/");
      }
    });
  }

  function togglePassword() {
    setShowPassword(!showPassword);
  }
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Signup</h1>
      <div className={styles.form}>
        <div className={`${styles.input} ${styles.name}`}>
          <label htmlFor="name">이름</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="이름을 입력하세요"
            ref={nameRef}
            onChange={handleChange}
          />
          {isValidName ? null : (
            <div className={styles.vm}>이름은 3글자 이상 30자 이하입니다.</div>
          )}
        </div>
        <div className={styles.input}>
          <label htmlFor="email">이메일</label>
          <input
            id="email"
            name="email"
            type="text"
            placeholder="이메일을 입력하세요"
            ref={emailRef}
            onChange={handleChange}
          />
          {isValidEmail ? null : (
            <div className={styles.vm}>올바른 이메일 형식이 아닙니다.</div>
          )}
        </div>
        <div className={styles.input}>
          <label htmlFor="password">비밀번호</label>
          {showPassword ? (
            <input
              id="password"
              name="password"
              type="text"
              placeholder="비밀번호를 입력하세요"
              ref={passwordRef}
              onChange={handleChange}
            />
          ) : (
            <input
              id="password"
              name="password"
              type="password"
              placeholder="비밀번호를 입력하세요"
              ref={passwordRef}
              onChange={handleChange}
            />
          )}
          <span onClick={togglePassword}>
            {showPassword ? "비밀번호 숨기기" : "비밀번호 보이기"}
          </span>
          {isValidPassword ? null : (
            <div className={styles.vm}>
              비밀번호는 최소 하나 이상의 영문 대소문자와 숫자,
              특수문자(@!%*#?&)를 포함해야 합니다.
            </div>
          )}
          {isPwIncludesName ? (
            <div className={styles.vm}>
              비밀번호는 이름과 같은 문자열을 포함할 수 없습니다.
            </div>
          ) : null}
        </div>
        {userInfo.name && userInfo.email && userInfo.password ? (
          <button className={styles.btn} onClick={handleSignup}>
            회원가입
          </button>
        ) : (
          <button className={`${styles.btn} ${styles.invalid}`}>
            회원가입
          </button>
        )}
      </div>
    </div>
  );
}