import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Peer from "simple-peer";
import ysFixWebmDuration from "fix-webm-duration";
import toast from "react-hot-toast";

import { useGetUser } from "../../../../utils/queries/users";
import { drawNotice } from "../../../../utils/debates/debateroom/draw";
import { beep } from "../../../../utils/debates/debateroom/beep";
import { usePreventBack } from "../../../../utils/debates/debateroom/usePreventBack";
import { useAutoOff } from "../../../../utils/debates/debateroom/useAutoOff";
import { useSetInterval } from "../../../../utils/debates/debateroom/useSetInterval";
import { toggleReady } from "../../../../utils/debates/debateroom/toggle";
import styles from "../index.module.scss";

import ConfirmModal from "../../../common/modal/ConfirmModal";
import Canvas from "./Canvas";
import Buttons from "./Button";

import { TTurn } from "../../../../types";

export default function ExperienceDebateroom() {
  const router = useRouter();
  //# 모달 변수
  const [isDoneModalOn, setIsDoneModalOn] = useState<boolean>(false);
  const [isReadyModalOn, setIsReadyModalOn] = useState<boolean>(false);
  //# WebRTC 변수
  const peerRef = useRef<Peer.Instance | undefined>(undefined);
  //# 캔버스 변수
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  //# 스트림 변수
  const streamRef = useRef<MediaStream | undefined>();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const screenStreamRef = useRef<MediaStream | undefined>();
  //# 토글 변수
  const [isMicOn, setIsMicOn] = useState<boolean>(true);
  const [isVideoOn, setIsVideoOn] = useState<boolean>(false);
  const [isScreenOn, setIsScreenOn] = useState<boolean>(false);
  const [isReady, setIsReady] = useState<boolean>(false);
  //# 토론변수
  const [isStart, setIsStart] = useState<boolean>(false);
  const [turn, setTurn] = useState<TTurn>("none");
  //# 녹화 변수
  const recorderRef = useRef<MediaRecorder | undefined>();
  const blobsRef = useRef<Blob[]>([]);
  const blobRef = useRef<Blob | undefined>();
  const aRef = useRef<HTMLAnchorElement | null>(null);
  //# 토론 진행 변수
  const [isDebating, setIsDebating] = useState<boolean>(false);
  const [curDebate, setCurDebate] = useState<{
    notice: string;
    turn: number;
    time: number;
  }>({ notice: "", turn: 0, time: 4 });
  const [debateProgress] = useState<[string, number][]>([
    ["토론이 곧 시작됩니다.", 3],
    ["찬성 측 입론", 240],
    ["반대 측 교차 조사", 180],
    ["반대 측 입론", 240],
    ["찬성 측 교차 조사", 180],
    ["찬성 측 반론 및 요약", 180],
    ["반대 측 반론 및 요약", 180],
    ["토론이 종료되었습니다.", 0],
  ]);
  const startTimeRef = useRef<number>(Date.now());

  //# 서버 정보
  const user = useGetUser();

  //# 토론 정보
  const DEBATE_INFO = {
    id: 0,
    title: "Debate-Ducks의 체험 토론입니다.",
    contents: "",
    category: "기타",
    video_url: null,
    author_pros: true,
    created_date: "",
    updated_date: null,
    author: {
      id: "",
      nickname: user.data?.nickname || "체험 아이디",
      email: "",
      profile_image: null,
    },
    participant: {
      id: "",
      nickname: "반대 아이디",
      email: "",
      profile_image: null,
    },
    factchecks: [],
    hearts_cnt: 0,
    vote: { prosCnt: 0, consCnt: 0 },
  };

  //# 토론 진행
  const [debateStart, debateStop] = useSetInterval(
    () => setIsDebating((prevState) => !prevState),
    1000,
  );

  //# 토론 진행
  useEffect(() => {
    setCurDebate((prevState) => {
      //> 시작 전에는 변하지 않게 만듦
      if ((prevState.turn === 7 && prevState.time < 0) || !isStart) {
        return prevState;
      }

      if (prevState.turn < 7 && prevState.time < 2) {
        return {
          notice: debateProgress[prevState.turn + 1][0],
          turn: prevState.turn + 1,
          time: debateProgress[prevState.turn + 1][1],
        };
      } else {
        return {
          notice: prevState.notice,
          turn: prevState.turn,
          time: prevState.time - 1,
        };
      }
    });
  }, [DEBATE_INFO.title, debateProgress, isDebating, isStart]); // dependency에 isDebating 필요

  //# 토론 그리기
  useEffect(() => {
    let turn: TTurn = "none";
    if (curDebate.turn === 7 && curDebate.time < 0) {
      if (recorderRef.current?.state === "recording") {
        recorderRef.current?.stop();
      }
      debateStop();
      setIsDoneModalOn(true);
    } else {
      if (curDebate.turn === 0 && curDebate.time < 4) turn = "notice";
      if (curDebate.turn === 1 || curDebate.turn === 5) turn = "pros";
      if (curDebate.turn === 3 || curDebate.turn === 6) turn = "cons";
      if (curDebate.turn === 4) turn = "prosCross";
      if (curDebate.turn === 2) turn = "consCross";
      setTurn(turn);
      drawNotice({ canvasRef, turn }, curDebate, DEBATE_INFO.title);
      if (curDebate.time === 10 || curDebate.time === 1) beep();
    }
  }, [DEBATE_INFO.title, curDebate, debateStop]);

  //# 토론 준비
  const handleReady = () => {
    setIsReadyModalOn(true);
  };

  //# 뒤로가기 방지
  usePreventBack();

  //# 최초 연결
  useEffect(() => {
    //> 미디어 획득 및 연결
    navigator.mediaDevices
      .getUserMedia({
        video: { facingMode: "user", width: 500, height: 500 },
        audio: { echoCancellation: true, noiseSuppression: true },
      })
      .then((stream) => {
        streamRef.current?.getTracks().forEach((track) => {
          track.stop();
        });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;
        //> 녹화 준비
        const mergedAudioRef = stream.getAudioTracks();
        const setRecorder = () => {
          //- 30fps로 캔버스 요소 녹화
          const canvasStream = canvasRef.current?.captureStream(30);

          if (!canvasStream || !mergedAudioRef) return;
          //- 캔버스 녹화 영상과 합친 오디오 병합
          const mergedTracks = canvasStream
            .getVideoTracks()
            .concat(mergedAudioRef);

          if (!mergedTracks) return;
          const mergedStream = new MediaStream(mergedTracks);

          if (!mergedStream) return;
          let recorder;
          try {
            recorder = new MediaRecorder(mergedStream, {
              mimeType: "video/webm",
            });
          } catch (err1) {
            try {
              recorder = new MediaRecorder(mergedStream, {
                mimeType: "video/mp4",
              });
            } catch (err2) {
              toast.error("녹화 준비에 실패 했습니다.");
            }
          }

          if (!recorder) return;
          recorderRef.current = recorder;
          //- 녹화 중
          recorderRef.current.ondataavailable = (ev) => {
            blobsRef.current.push(ev.data);
          };
          //- 녹화 종료 후
          recorderRef.current.onstop = () => {
            const duration = Date.now() - startTimeRef.current;
            const blob = new Blob(blobsRef.current, {
              type: "video/webm",
            });
            ysFixWebmDuration(blob, duration, { logger: false }).then(
              (fixedBlob) => {
                blobRef.current = fixedBlob;
              },
            );
            blobsRef.current = [];
          };
        };
        setRecorder();
      });

    //> 최초 공지
    drawNotice(
      { canvasRef, turn: "none" },
      {
        notice: DEBATE_INFO.title,
        turn: 7,
        time: 3,
      },
      DEBATE_INFO.title,
    );
  }, [DEBATE_INFO.title]);

  //# 자동 끄기
  useAutoOff({
    isPros: true,
    peerRef,
    streamRef,
    videoRef,
    screenStreamRef,
    setIsMicOn,
    setIsScreenOn,
    isPeerScreenOn: false,
    isReady,
    turn,
  });

  return (
    <>
      {isDoneModalOn ? (
        <ConfirmModal
          title={"토론 종료"}
          content={"토론이 종료되었습니다.\n녹화 영상을 다운받으시겠습니까?"}
          firstBtn={"아니요"}
          firstFunc={() => {
            streamRef.current?.getTracks().forEach((track) => {
              track.stop();
            });
            router.push(`/q&a`);
          }}
          secondBtn={"네"}
          secondFunc={() => {
            streamRef.current?.getTracks().forEach((track) => {
              track.stop();
            });
            if (!blobRef.current) return;
            const url = window.URL.createObjectURL(blobRef.current);
            if (!aRef.current) return;
            aRef.current.href = url;
            aRef.current?.click();
            window.URL.revokeObjectURL(url);
            router.push(`/q&a`);
          }}
        />
      ) : null}
      {isReadyModalOn ? (
        <ConfirmModal
          title={"체험 토론 시작"}
          content={
            "체험 토론은 토론 중 차례 넘기기와 퇴장이 자유롭게 가능합니다. 중간에 퇴장하지 않고 토론을 마치시면 녹화 영상을 다운로드할 수 있습니다. 체험 토론을 시작하시겠습니까?"
          }
          firstBtn={"아니요"}
          firstFunc={() => {
            toggleReady({ isReady: !isReady, setIsReady });
            setIsReadyModalOn(false);
          }}
          secondBtn={"체험 시작"}
          secondFunc={() => {
            setIsReadyModalOn(false);
            setIsStart(true);
            debateStart();
            recorderRef.current?.start(1000 / 30);
            startTimeRef.current = Date.now();
          }}
        />
      ) : null}
      <div className="inner">
        <Canvas
          debate={DEBATE_INFO}
          canvasRef={canvasRef}
          streamRef={streamRef}
          videoRef={videoRef}
          isVideoOn={isVideoOn}
          isScreenOn={isScreenOn}
        />
        <div className={styles.video_box}>
          <video
            ref={videoRef}
            muted
            autoPlay
            playsInline
            width={0.1}
            height={0.1}
          ></video>
        </div>
        <Buttons
          peerRef={peerRef}
          streamRef={streamRef}
          videoRef={videoRef}
          screenStreamRef={screenStreamRef}
          isMicOn={isMicOn}
          setIsMicOn={setIsMicOn}
          isVideoOn={isVideoOn}
          setIsVideoOn={setIsVideoOn}
          isScreenOn={isScreenOn}
          setIsScreenOn={setIsScreenOn}
          isReady={isReady}
          setIsReady={setIsReady}
          isStart={isStart}
          turn={turn}
          recorderRef={recorderRef}
          curDebate={curDebate}
          setCurDebate={setCurDebate}
          handleReady={handleReady}
        />
        <a ref={aRef} download={`${DEBATE_INFO.title}.webm`} />
      </div>
    </>
  );
}
