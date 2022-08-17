import { useEffect } from "react";

//* 뒤로가기 방지
export const usePreventBack = () => {
  useEffect(() => {
    const preventGoBack = () => {
      history.pushState(null, "", location.href);
    };

    history.pushState(null, "", location.href);

    window.addEventListener("popstate", preventGoBack);

    return () => window.removeEventListener("popstate", preventGoBack);
  }, []);
};
