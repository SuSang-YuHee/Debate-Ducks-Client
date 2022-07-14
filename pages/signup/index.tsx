import axios from "axios";
import { useRef, useState } from "react";

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
  const [name, setName] = useState<string | undefined>("");
  const [email, setEmail] = useState<string | undefined>("");
  const [password, setPassword] = useState<string | undefined>("");
  const nameRef = useRef<HTMLInputElement | null>(null);
  const emailRef = useRef<HTMLInputElement | null>(null);
  const passwordRef = useRef<HTMLInputElement | null>(null);
  function handleBlur() {
    setUserInfo({
      name,
      email,
      password,
    });
  }
  function changeName() {
    const nameValue = nameRef.current?.value;
    setName(nameValue);
  }
  function changeEmail() {
    setEmail(emailRef.current?.value);
  }
  function changePassword() {
    setPassword(passwordRef.current?.value);
  }
  function handleSignup() {
    axios
      .post("http://localhost:80/users", userInfo)
      .then((res) => console.log(res));
    console.log(userInfo);
  }
  return (
    <div>
      <h1>Signup</h1>
      <div>
        <input
          type="text"
          placeholder="이름을 입력하세요"
          ref={nameRef}
          onBlur={handleBlur}
          onChange={changeName}
        />
        <br />
        <input
          type="text"
          placeholder="이메일을 입력하세요"
          ref={emailRef}
          onBlur={handleBlur}
          onChange={changeEmail}
        />
        <br />
        <input
          type="password"
          placeholder="비밀번호를 입력하세요"
          ref={passwordRef}
          onBlur={handleBlur}
          onChange={changePassword}
        />
        <br />
        <button onClick={handleSignup}>회원가입</button>
      </div>
    </div>
  );
}
