import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { AiFillHome } from "react-icons/ai";
import _ from "lodash";

import styles from "./HomeAndTopBtn.module.scss";

export default function HomeAndTopBtn({
  isHomeBtnOn,
}: {
  isHomeBtnOn: boolean;
}) {
  const router = useRouter();
  const [scrollY, setScrollY] = useState<number>(0);

  const handleScrollY = () => {
    setScrollY(window.pageYOffset);
  };

  useEffect(() => {
    const watch = () => {
      window.addEventListener("scroll", _.debounce(handleScrollY, 100));
    };
    watch();
    return () => {
      window.removeEventListener("scroll", _.debounce(handleScrollY, 100));
    };
  });

  useEffect(() => {
    setScrollY(window.pageYOffset);
  }, []);

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
