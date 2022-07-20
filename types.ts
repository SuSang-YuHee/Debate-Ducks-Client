import { ChangeEvent, Dispatch, SetStateAction } from "react";

//*- users
export interface User {
  id: string;
  name: string;
  email: string;
}

//*- debates
export interface Debate {
  id: number;
  author: User;
  title: string;
  contents: string;
  category: string;
  video_url: string;
  participant: User;
  author_pros: boolean;
  created_date: string;
  updated_date: string;
  ended_date: string;
}

export interface DebatePost
  extends Pick<Debate, "title" | "contents" | "category" | "author_pros"> {
  author_id: string;
}

type TempDebatePatch = Pick<Debate, "id"> &
  Partial<Pick<Debate, "title" | "contents" | "category" | "author_pros">>;
export interface DebatePatch extends TempDebatePatch {
  participant_id?: string;
}

//*- useInPutSelect
export interface ResultUseInput {
  attribute: {
    value: string;
    placeholder: string;
    onChange: (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  };
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
}

export interface ResultUseRadio {
  attributeTrue: {
    type: string;
    name: string;
    value: string;
    checked: boolean;
    onChange: (ev: ChangeEvent<HTMLInputElement>) => void;
  };
  attributeFalse: {
    type: string;
    name: string;
    value: string;
    checked: boolean;
    onChange: (ev: ChangeEvent<HTMLInputElement>) => void;
  };
  value: boolean;
  setValue: Dispatch<SetStateAction<string>>;
}

export interface ResultUseSelect {
  attribute: {
    value: string;
    onChange: (ev: ChangeEvent<HTMLSelectElement>) => void;
  };
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
}
