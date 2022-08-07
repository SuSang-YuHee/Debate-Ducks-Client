import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiFillHome } from "react-icons/ai";

import styles from "./HomeAndTopBtn.module.scss";

export default function HomeAndTopBtn({
  isHomeBtnOn,
}: {
  isHomeBtnOn: boolean;
}) {
  const router = useRouter();
  const [scrollY, setScrollY] = useState<number>(window.pageYOffset);

  const handleScrollY = () => {
    setScrollY(window.pageYOffset);
  };

  useEffect(() => {
    const watch = () => {
      window.addEventListener("scroll", handleScrollY);
    };
    watch();
    return () => {
      window.removeEventListener("scroll", handleScrollY);
    };
  });

  return (
    <>
      {isHomeBtnOn ? (
        <div
          className={`${styles.fix_btn} ${
            scrollY !== 0 ? styles.fix_btn_home : ""
          }`}
          onClick={() => router.push("/")}
        >
          <AiFillHome />
        </div>
      ) : null}
      <div
        className={`${styles.fix_btn} ${
          scrollY === 0 ? styles.fix_btn_hide : ""
        }`}
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      >
        ▲
      </div>
    </>
  );
}
