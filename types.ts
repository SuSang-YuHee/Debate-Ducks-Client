import { ChangeEvent, Dispatch, MutableRefObject, SetStateAction } from "react";
import { Socket } from "socket.io-client";
import Peer from "simple-peer";

//*> debateroom
export interface IDebateroom {
  //* Props 타입
  debateId: string;
  socketRef: MutableRefObject<Socket>;
  debate: IDebate;
  isPros: boolean;
  //* 모달 타입
  setIsDoneModalOn: Dispatch<SetStateAction<boolean>>;
  setIsPauseModalOn: Dispatch<SetStateAction<boolean>>;
  setIsUploadModalOn: Dispatch<SetStateAction<boolean>>;
  //* WebRTC 타입
  peerRef: MutableRefObject<Peer.Instance | undefined>;
  //* 캔버스 타입
  canvasRef: MutableRefObject<HTMLCanvasElement | null>;
  //* 스트림 타입
  streamRef: MutableRefObject<MediaStream | undefined>;
  peerStream: MediaStream | undefined;
  setPeerStream: Dispatch<SetStateAction<MediaStream | undefined>>;
  videoRef: MutableRefObject<HTMLVideoElement | null>;
  peerVideoRef: MutableRefObject<HTMLVideoElement | null>;
  screenStreamRef: MutableRefObject<MediaStream | undefined>;
  //* 토글 타입
  isMicOn: boolean;
  setIsMicOn: Dispatch<SetStateAction<boolean>>;
  isVideoOn: boolean;
  setIsVideoOn: Dispatch<SetStateAction<boolean>>;
  isPeerVideoOn: boolean;
  setIsPeerVideoOn: Dispatch<SetStateAction<boolean>>;
  isScreenOn: boolean;
  setIsScreenOn: Dispatch<SetStateAction<boolean>>;
  isPeerScreenOn: boolean;
  setIsPeerScreenOn: Dispatch<SetStateAction<boolean>>;
  isReady: boolean;
  setIsReady: Dispatch<SetStateAction<boolean>>;
  //* 토론 타입
  isStart: boolean;
  setIsStart: Dispatch<SetStateAction<boolean>>;
  isDoneRef: MutableRefObject<boolean>;
  turn: TTurn;
  setTurn: Dispatch<SetStateAction<TTurn>>;
  isSkipTime: boolean;
  setIsSkipTime: Dispatch<SetStateAction<boolean>>;
  //* 녹화 타입
  mergedAudioRef: MutableRefObject<MediaStreamTrack[] | undefined>;
  recorderRef: MutableRefObject<MediaRecorder | undefined>;
  blobsRef: MutableRefObject<Blob[]>;
  blobRef: MutableRefObject<Blob | undefined>;
  aRef: MutableRefObject<HTMLAnchorElement | null>;
}

export type TTurn =
  | "none"
  | "notice"
  | "pros"
  | "cons"
  | "prosCross"
  | "consCross";

export interface IDebateData {
  notice: string;
  turn: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;
  time: number;
}

export interface IDummy {
  topic: string;
  prosName: string;
  consName: string;
}

//*- users
export interface IUser {
  id: string;
  nickname: string;
  email: string;
  profile_image: string | null;
}

export interface IUserInfo {
  name: string | undefined;
  email: string | undefined;
  password: string | undefined;
}

//*- debates
export interface IDebate {
  id: number;
  title: string;
  contents: string;
  category: string;
  video_url: string | null;
  author_pros: boolean;
  created_date: string;
  updated_date: string | null;
  author: IUser | null;
  participant: IUser | null;
  factchecks: IFactcheck[];
  hearts_cnt: number;
  vote: { prosCnt: number; consCnt: number };
}

export type TDebateOfDebates = Omit<IDebate, "factchecks" | "vote">;

export interface IDebatePost
  extends Pick<IDebate, "title" | "contents" | "category" | "author_pros"> {
  author_id: string;
}

type TDebatePatch = Pick<IDebate, "id"> &
  Partial<
    Pick<
      IDebate,
      "title" | "contents" | "category" | "author_pros" | "video_url"
    >
  >;
export interface IDebatePatch extends TDebatePatch {
  participant_id?: string;
}

//*- factchecks
export interface IFactcheck {
  id: number;
  pros: boolean;
  description: string;
  reference_url: string;
}

export type TFactcheckPost = Pick<
  IFactcheck,
  "pros" | "description" | "reference_url"
> &
  IDebateAndUserID;

export type TFactcheckPatch = Pick<
  IFactcheck,
  "id" | "description" | "reference_url"
>;

//*- debate and user id
export interface IDebateAndUserID {
  target_debate_id: number;
  target_user_id: string;
}

//*- votes
export interface IVote {
  isVote: boolean;
  pros: boolean;
}

export interface IVotePostOrPatch extends IDebateAndUserID {
  pros: boolean;
}

//*- comments
export interface ICommentOfDebate {
  id: number;
  pros: boolean | null;
  contents: string;
  created_date: string;
  updated_date: string | null;
  target_user: IUser;
}

export interface ICommentPost extends IDebateAndUserID {
  pros: boolean | null;
  contents: string;
}

export interface ICommentPatch {
  id: number;
  pros: boolean | null;
  contents: string;
}

//*- useInPutSelect
export interface IUseInputResult {
  attribute: {
    value: string;
    placeholder: string;
    onChange: (ev: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  };
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
}

export interface IUseRadioResult {
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

export interface IUseSelectResult {
  attribute: {
    value: string;
    onChange: (ev: ChangeEvent<HTMLSelectElement>) => void;
  };
  value: string;
  setValue: Dispatch<SetStateAction<string>>;
}
