import { useRouter } from "next/router";
import { BaseSyntheticEvent, useRef, useState } from "react";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { postUser } from "../../api/users";
import styles from "./Signup.module.scss";

import ConfirmModal from "../../components/common/modal/ConfirmModal";

import { UserInfo } from "../../types";

export default function SignupPage() {
  const [isWaitingModalOn, SetIsWaitingModalOn] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfo>({
    name: "",
    email: "",
    password: "",
  });
  const [isValidName, setIsValidName] = useState<boolean>(true);
  const [isValidEmail, setIsValidEmail] = useState<boolean>(true);
  const [isValidPassword, setIsValidPassword] = useState<boolean>(true);
  const [isValidPasswordCheck, setIsValidPasswordCheck] =
    useState<boolean>(true);
  const [isPwIncludesName, setIsPwIncludesName] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordCheck, setShowPasswordCheck] = useState(false);
  const [checkPassword, setCheckPassword] = useState("");
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  const passwordCheckRef = useRef<HTMLInputElement | null>(null);

  const router = useRouter();

  const emailRegExp =
    /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
  const passwordRegExp =
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@!%*#?&])[A-Za-z\d@!%*#?&]{8,}$/i;

  function handleChange(e: BaseSyntheticEvent) {
    const value = e.target.value;
    const valueType = e.target.name;
    if (valueType === "name") {
      if (value.length >= 2 && value.length <= 15) {
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
      if (value === checkPassword) {
        setIsValidPasswordCheck(true);
      } else {
        setIsValidPasswordCheck(false);
      }
    } else if (valueType === "checkPassword") {
      if (value === userInfo.password) {
        setIsValidPasswordCheck(true);
      } else {
        setIsValidPasswordCheck(false);
      }
      setCheckPassword(value);
    }
  }

  function handleSignup() {
    SetIsWaitingModalOn(true);
    postUser(userInfo, () => {
      SetIsWaitingModalOn(false);
      router.push("/signin");
    });
  }

  function togglePassword() {
    setShowPassword(!showPassword);
  }

  function togglePasswordCheck() {
    setShowPasswordCheck(!showPasswordCheck);
  }

  return (
    <>
      {isWaitingModalOn ? (
        <ConfirmModal
          title={"회원가입"}
          content={"회원가입 중입니다. 잠시만 기다려 주십시오."}
        />
      ) : null}
      <div className={styles.outer}>
        <div className={styles.container}>
          <h1 className={styles.title}>회원가입</h1>
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
                <div className={styles.vm}>
                  이름은 2자 이상, 15자 이하여야 합니다.
                </div>
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
                <div className={styles.wrapper}>
                  <input
                    id="password"
                    name="password"
                    type="text"
                    placeholder="비밀번호를 입력하세요"
                    ref={passwordRef}
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
                    ref={passwordRef}
                    onChange={handleChange}
                  />
                  <span onClick={togglePassword} className={styles.show}>
                    {showPassword ? <FiEyeOff /> : <FiEye />}
                  </span>
                </div>
              )}

              {isValidPassword ? null : (
                <div className={styles.vm}>
                  최소 하나 이상의 영문 대소문자와 숫자, 특수문자(@!%*#?&)를
                  포함해야 합니다.
                </div>
              )}
              {isPwIncludesName ? (
                <div className={styles.vm}>
                  이름은 비밀번호에 포함할 수 없습니다.
                </div>
              ) : null}
            </div>
            <div className={styles.input}>
              <label htmlFor="checkPassword">비밀번호 확인</label>
              {showPasswordCheck ? (
                <div className={styles.wrapper}>
                  <input
                    id="checkPassword"
                    name="checkPassword"
                    type="text"
                    placeholder="비밀번호를 재입력하세요"
                    onChange={handleChange}
                    ref={passwordCheckRef}
                  />
                  <span onClick={togglePasswordCheck} className={styles.show}>
                    {showPasswordCheck ? <FiEyeOff /> : <FiEye />}
                  </span>
                </div>
              ) : (
                <div className={styles.wrapper}>
                  <input
                    id="checkPassword"
                    name="checkPassword"
                    type="password"
                    placeholder="비밀번호를 재입력하세요"
                    onChange={handleChange}
                    ref={passwordCheckRef}
                  />
                  <span onClick={togglePasswordCheck} className={styles.show}>
                    {showPasswordCheck ? <FiEyeOff /> : <FiEye />}
                  </span>
                </div>
              )}
              {isValidPasswordCheck ? null : (
                <div className={styles.vm}>비밀번호가 일치하지 않습니다.</div>
              )}
            </div>
            {userInfo.name &&
            userInfo.email &&
            userInfo.password &&
            isValidPasswordCheck &&
            passwordCheckRef.current?.value.length !== 0 ? (
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
      </div>
    </>
  );
}
