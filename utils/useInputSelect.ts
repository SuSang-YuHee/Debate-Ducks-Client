import { useState, ChangeEvent } from "react";

import { ResultUseInput, ResultUseRadio, ResultUseSelect } from "../types";

export const useInput = (
  initialValue: string,
  placeholder: string,
): ResultUseInput => {
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
): ResultUseRadio => {
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

export const useSelect = (initialValue: string): ResultUseSelect => {
  const [value, setValue] = useState(initialValue);

  const onChange = (ev: ChangeEvent<HTMLSelectElement>) => {
    if (ev.target.value !== value) setValue(ev.target.value);
  };

  return {
    attribute: { value, onChange },
    value,
    setValue,
  };
};