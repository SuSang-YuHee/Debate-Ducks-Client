import axios from "axios";
import { useRouter } from "next/router";
import { ChangeEvent, useState } from "react";

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
          router.push("/");
        }
      });
  }

  function togglePassword() {
    setShowPassword(!showPassword);
  }
  return (
    <div>
      <h1>Signin</h1>
      <div>
        <div>
          <label htmlFor="email">이메일</label>
          <input id="email" name="email" type="text" onChange={handleChange} />
        </div>
        <div>
          <label htmlFor="password">비밀번호</label>
          {showPassword ? (
            <input
              id="password"
              name="password"
              type="text"
              onChange={handleChange}
            />
          ) : (
            <input
              id="password"
              name="password"
              type="password"
              onChange={handleChange}
            />
          )}
          <span onClick={togglePassword}>
            {showPassword ? "비밀번호 숨기기" : "비밀번호 보이기"}
          </span>
        </div>
        <div>
          <button onClick={handleSignin}>로그인</button>
        </div>
      </div>
    </div>
  );
}
