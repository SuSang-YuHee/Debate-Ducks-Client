import axios from "axios";
// import { useRouter } from "next/router";
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
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);

  // const router = useRouter();

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
      }
    } else if (valueType === "email") {
      if (value.match(emailRegExp) !== null) {
        setIsValidEmail(true);
        setUserInfo({ ...userInfo, [valueType]: value });
      } else {
        setIsValidEmail(false);
      }
    } else if (valueType === "password") {
      if (!value.includes(userInfo.name)) {
        if (value.match(passwordRegExp) !== null) {
          setIsValidPassword(true);
          setUserInfo({ ...userInfo, [valueType]: value });
        } else {
          setIsValidPassword(false);
          setIsPwIncludesName(false);
        }
      } else {
        setIsPwIncludesName(true);
      }
    }
  }
  function handleSignup() {
    console.log(userInfo);
    // axios.post("http://localhost:80/users", userInfo).then((res) => {
    //   if (res.statusText === "Created") {
    //     router.push("/");
    //   }
    // });
  }
  // function verify(type: string, value: string): boolean | undefined {
  //   if (type === "name") {
  //     return value.length >= 3 && value.length <= 30;
  //   } else if (type === "email") {
  //     return value.match(emailRegExp) !== null;
  //   } else if (type === "password") {
  //     if (userInfo.name !== undefined) {
  //       return (
  //         value.match(passwordRegExp) !== null
  //       );
  //     }
  //   }
  // }
  // const [isValidName, setIsValidName] = useState<boolean>(true);
  // const [isValidEmail, setIsValidEmail] = useState<boolean>(true);
  // const [isValidPassword, setIsValidPassword] = useState<boolean>(true);
  // const [isValidUserInfo, setIsValidUserInfo] = useState<boolean>(false);
  // const router = useRouter();
  // function changeName() {
  //   const nameValue: string | undefined = nameRef.current?.value;
  //   if (!(nameValue === undefined)) {
  //     if (nameValue.length < 3 || nameValue.length > 30) {
  //       setIsValidUserInfo(isValidName && isValidEmail && isValidPassword);
  //       setIsValidName(false);
  //     } else {
  //       setIsValidUserInfo(isValidName && isValidEmail && isValidPassword);
  //       setIsValidName(true);
  //       setName(nameRef.current?.value);
  //     }
  //   }
  // }
  // function changeEmail() {
  //   const emailValue: string | undefined = emailRef.current?.value;
  //   const regExp =
  //     ;
  //   if (!(emailValue === undefined)) {
  //     if (emailValue.length > 0) {
  //       if (emailValue.match(regExp) !== null) {
  //         setIsValidUserInfo(isValidName && isValidEmail && isValidPassword);
  //         setIsValidEmail(true);
  //         setEmail(emailRef.current?.value);
  //       } else {
  //         setIsValidUserInfo(isValidName && isValidEmail && isValidPassword);
  //         setIsValidEmail(false);
  //       }
  //     }
  //   }
  // }
  // function changePassword() {
  //   const passwordValue: string | undefined = passwordRef.current?.value;
  //   const regExp =
  //     ;
  //   if (!(passwordValue === undefined)) {
  //     if (passwordValue.length > 0) {
  //       if (name !== undefined && passwordValue?.includes(name)) {
  //         console.log("비밀번호는 이름과 같은 문자열을 포함할 수 없습니다.");
  //       } else {
  //         if (passwordValue.match(regExp) !== null) {
  //           setIsValidUserInfo(isValidName && isValidEmail && isValidPassword);
  //           setIsValidPassword(true);
  //         } else {
  //           setIsValidUserInfo(isValidName && isValidEmail && isValidPassword);
  //           setIsValidPassword(false);
  //         }
  //       }
  //     }
  //   }
  //   setPassword(passwordRef.current?.value);
  // }
  // function handleSignup() {
  //   if (!isValidUserInfo) {
  //     console.log("회원가입 비활성화");
  //   } else {
  //     console.log("회원가입 활성화");
  //     axios.post("http://localhost:80/users", userInfo).then((res) => {
  //       if (res.statusText === "Created") {
  //         router.push("/");
  //       }
  //     });
  //   }
  // }
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
          <input
            id="password"
            name="password"
            type="password"
            placeholder="비밀번호를 입력하세요"
            ref={passwordRef}
            onChange={handleChange}
          />
          {isValidPassword ? null : (
            <div className={styles.vm}>
              비밀번호는 최소 하나 이상의 영문 대소문자와 숫자, 특수문자를
              포함해야 합니다.
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
