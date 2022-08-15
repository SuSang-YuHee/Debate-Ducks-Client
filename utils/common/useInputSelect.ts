import { useState, ChangeEvent } from "react";

import { UseInputResult, UseRadioResult, UseSelectResult } from "../../types";

export const useInput = (
  initialValue: string,
  placeholder: string,
): UseInputResult => {
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

export const useRadio = (
  initialValue: "true" | "false",
  name: string,
): UseRadioResult => {
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

export const useSelect = (
  initialValue: string,
  callback?: () => void,
  setSelect?: (params: string) => void,
): UseSelectResult => {
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
