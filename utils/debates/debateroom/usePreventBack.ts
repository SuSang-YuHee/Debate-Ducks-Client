import { useEffect } from "react";

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
