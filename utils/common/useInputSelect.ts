import { useState, ChangeEvent } from "react";

import { IUseInputResult, I, IUseSelectResult } from "../../types";

//* string 인풋 요소의 value 관리
//* ex. const exampleInput = useInput("초기값", "") / <input {...exampleInput.attribute} />
export const useInput = (
  initialValue: string,
  placeholder: string,
): IUseInputResult => {
  const [value, setValue] = useState(initialValue);

  const onChange = (
    ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ): void => {
    setValue(ev.target.value);
  };

  return {
    attribute: { value, placeholder, onChange },
    value,
    setValue,
  };
};

//* boolean 인풋 요소의 value 관리
//* ex. const exampleRadio = useRadio("true", "example") / <input {...exampleRadio.attributeTrue} /><input {...exampleRadio.attributeFalse} />
export const useRadio = (initialValue: "true" | "false", name: string): I => {
  const [value, setValue] = useState<string>(initialValue);

  const onChange = (ev: ChangeEvent<HTMLInputElement>) => {
    if (ev.target.value !== value) setValue(ev.target.value);
  };

  return {
    attributeTrue: {
      type: "radio",
      name,
      value: "true",
      checked: value === "true",
      onChange,
    },
    attributeFalse: {
      type: "radio",
      name,
      value: "false",
      checked: value === "false",
      onChange,
    },
    value: value === "true" ? true : false,
    setValue,
  };
};

//* 선택 요소의 value 관리
//* ex. const exampleSelect = useSelect(EXAMPLES[0]) / <select {...exampleSelect.attribute}>{EXAMPLES.map((ex) => (<option key={ex}>{ex}</option>))}</select>
export const useSelect = (
  initialValue: string,
  callback?: () => void,
  setSelect?: (params: string) => void,
): IUseSelectResult => {
  const [value, setValue] = useState(initialValue);

  const onChange = (ev: ChangeEvent<HTMLSelectElement>) => {
    if (ev.target.value !== value) {
      setValue(ev.target.value);
      if (callback) callback();
      if (setSelect) setSelect(ev.target.value);
    }
  };

  return {
    attribute: { value, onChange },
    value,
    setValue,
  };
};
