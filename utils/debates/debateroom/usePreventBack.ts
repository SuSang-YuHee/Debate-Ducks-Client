import { useEffect } from "react";
import toast from "react-hot-toast";

//> 뒤로가기 방지
export const usePreventBack = () => {
  useEffect(() => {
    const preventGoBack = () => {
      history.pushState(null, "", location.href);
      toast.error("현재 페이지에서는 뒤로가기를 사용할 수 없습니다.");
    };

    history.pushState(null, "", location.href);

    window.addEventListener("popstate", preventGoBack);

    return () => window.removeEventListener("popstate", preventGoBack);
  }, []);
};
