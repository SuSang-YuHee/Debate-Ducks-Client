import { toast } from "react-hot-toast";
import { RefObject } from "react";

import { UseInputResult } from "../../types";

export const createOrEdit = (
  titleRef: RefObject<HTMLInputElement>,
  titleInput: UseInputResult,
  callback: () => void,
) => {
  const title = titleInput.value;

  if (/^\s|\s$/.test(title)) {
    toast.error("제목은 공백으로 시작하거나 끝날 수 없습니다.");
    titleRef.current?.focus();
    return;
  }
  if (/[^\s\w가-힣.,!?%&()]/.test(title)) {
    toast.error(
      "제목은 한글, 영어, 숫자 및 특수문자【.,!?%&()_】만 포함 가능합니다.",
    );
    titleRef.current?.focus();
    return;
  }
  if (title.length < 5 || title.length > 50) {
    toast.error("제목은 5자 이상, 50자 이하여야 합니다.");
    titleRef.current?.focus();
    return;
  }

  callback();
};
