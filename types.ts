import { ChangeEvent, Dispatch, SetStateAction } from "react";

//*- common
export type Order = "ASC" | "DESC";

//*- users
export interface User {
  id: string;
  nickname: string;
  email: string;
  profile_image: string | null;
}

//*- debates
export interface Debate {
  id: number;
  title: string;
  contents: string;
  category: string;
  video_url: string | null;
  author_pros: boolean;
  created_date: string;
  updated_date: string | null;
  author: User;
  participant: User | null;
  factchecks: Factcheck[];
  heartCnt: number;
  vote: { prosCnt: number; consCnt: number };
}

export interface DebatePost
  extends Pick<Debate, "title" | "contents" | "category" | "author_pros"> {
  author_id: string;
}

type TempDebatePatch = Pick<Debate, "id"> &
  Partial<
    Pick<
      Debate,
      "title" | "contents" | "category" | "author_pros" | "video_url"
    >
  >;
export interface DebatePatch extends TempDebatePatch {
  participant_id?: string;
}

//*- factchecks
export interface Factcheck {
  id: number;
  pros: boolean;
  description: string;
  reference_url: string;
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
