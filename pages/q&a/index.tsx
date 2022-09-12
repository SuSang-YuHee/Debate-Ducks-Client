import { useRouter } from "next/router";
import { useState } from "react";

import styles from "./index.module.scss";

export default function QnAPage() {
  const router = useRouter();
  const [openedDetail, setOpenedDetail] = useState<number[]>([]);

  const CONTENTS = [
    {
      title: "❗️토론 영상을 볼 수 없어요.",
      detail:
        "죄송합니다. 현재 사파리 브라우저에서는 토론 영상을 볼 수 없습니다. 다른 브라우저를 사용해 봐주시면 감사하겠습니다. 곧 개선하겠습니다.",
    },
    {
      title: "❗️토론 시작 전에 확인할 것이 있나요?",
      detail:
        "카메라, 마이크, 자동 재생 및 화면 기록 권한을 허용해 주셔야 합니다. 이전에 따로 설정하지 않으셨다면 해당 기능을 사용할 때 허용 요청이 갈 것입니다. 만약 이전에 권한을 차단하셨다면 해당 브라우저의 설정에서 허용으로 변경해 주셔야 합니다. 전체 화면 공유와 창 화면 공유의 경우에는 해당 컴퓨터의 설정에서 허용으로 변경해 주셔야 합니다. 추가로 토론 시작 전에 모든 화면 녹화를 멈춰주시기 바랍니다. 화면 녹화가 켜진 상태로 토론이 시작될 경우 토론 영상 녹화가 원활하게 진행되지 않을 수 있습니다. 토론을 시작하기 전에 확인해 주시길 바랍니다.",
    },
    {
      title: "체험 토론이 무엇인가요?",
      detail:
        "Debate Ducks의 정식 토론은 찬성과 반대 두 명의 참여자가 필요합니다. 그래서 있는 게 혼자서 토론을 진행해 볼 수 있는 체험 토론입니다. 체험 토론은 정식 토론과는 다르게 업로드되지 않고, 자신의 차례가 아니며 남은 시간이 2분 이상일 때도 차례 넘기기를 사용할 수 있습니다. 또한 체험 토론에서는 나가기 버튼이 계속 존재하지만 정식 토론에서는 토론 시작 시 나가기 버튼이 사라집니다.",
    },
    {
      title: "토론에 어떻게 참여하나요?",
      detail:
        "Debate Ducks에서 토론에 참여하는 방법은 두 가지입니다. 첫 번째는 [토론 만들기]를 통해 토론을 만든 다음 참여자를 기다리는 것이고, 두 번째는 참여 가능한 토론에서 [참여하기]를 통해 다른 사람이 만든 토론에 참여하는 것입니다. 참여자가 있는 토론은 대기 중인 토론이 되며, 참여자는 [입장하기]를 통해 실시간 영상 토론방으로 입장할 수 있습니다. 실시간 영상 토론방에서 참여자가 모두 [준비]한 경우 토론이 시작됩니다.",
    },
    {
      title: "토론은 어떤 방식으로 진행되나요?",
      detail:
        "토론은 [찬성 측 입론 → 반대 측 교차 조사 → 반대 측 입론 → 찬성 측 교차 조사 → 찬성 측 반론 및 요약 → 반대 측 반론 및 요약]의 순서로 진행됩니다. [입론 단계]에서는 논제에 대한 자신의 주장 및 근거를 말합니다. 새로운 주장을 펼치는 것은 오직 입론 단계에서만 가능합니다. [교차 조사 단계]에서는 상대측이 입론 단계에서 주장한 내용의 논리적 허점을 지적하고, 지적을 받은 상대는 이에 대한 답변을 해야 합니다. 답변이 길어지는 경우 질문자는 중단 후 다음 질문을 계속할 수 있습니다. [반론 및 요약 단계]에서는 상대측의 주장에 대한 반론을 펼치고, 자신의 입론을 보강 및 정리하며, 자신이 토론에서 승리한 이유를 설명합니다. 필요할 경우 상대측이 제기한 문제에 대해 추가적인 답변도 가능합니다.",
    },
    {
      title: "토론 중 연결이 끊기면 어떻게 되나요?",
      detail:
        "토론 중 상대방의 연결이 끊겼을 경우 현재까지 진행된 토론의 녹화 영상을 업로드하고 토론을 종료할지 아니면 토론을 처음부터 다시 진행할지를 선택할 수 있습니다. 중단된 시점부터 재시작은 불가능하기 때문에 토론은 안정적인 네트워크 환경에서 진행해 주시기 바랍니다.",
    },
    {
      title: "팩트체크에는 어떤 걸 적으면 되나요?",
      detail:
        "팩트체크에는 자신 주장의 근거와 상대 주장의 오류를 적으면 됩니다. 이때 참조 주소를 함께 적는 것을 권장합니다. 단 새로운 주장은 적으면 안 됩니다.",
    },
    {
      title: "투표의 기준은 어떻게 되나요?",
      detail:
        "투표는 자신의 의견과 일치하는 토론자가 아니라 토론을 더 잘했다고 판단되는 토론자에게 해주시기 바랍니다. 자신의 의견은 댓글을 통해서 표현할 수 있습니다. 판단의 기준은 주관적일 수 있으나 [입론 단계]에서 논제에 대한 이해가 정확하고 주장이 설득력 있으며 근거가 타당하고 신뢰할 만한 지, [교차 조사 단계]에서 상대측 주장과 근거의 문제점을 잘 지적하고 상대측이 지적한 문제점에 대해 적절한 답변을 하는지, [반론 및 요약 단계]에서 자신의 입론을 보강하며 주장을 분명히 하고 자신이 토론에서 승리한 이유를 잘 설명하는지, 마지막으로 토론 중 상대측을 존중하며 배려하는 태도를 지녔는지를 판단의 근거로 삼아주시길 바랍니다. 추가로 팩트체크가 작성되어 있다면 팩트체크도 판단의 기준으로 삼을 수 있습니다.",
    },
  ];

  const handleOpen = (num: number) => {
    if (openedDetail?.includes(num)) {
      const idx = openedDetail.indexOf(num);
      setOpenedDetail([...openedDetail.filter((_, i) => idx !== i)]);
    } else {
      setOpenedDetail([...openedDetail, num]);
    }
  };

  const checkOpen = (num: number) => {
    return openedDetail?.includes(num);
  };

  return (
    <div>
      <div className={styles.experience_box}>
        <pre className={styles.detail}>
          {
            "토론이 어떻게 진행되는지 궁금하다면\n혼자 하는 체험 토론을 진행해 보세요!"
          }
        </pre>
        <div
          className={styles.btn}
          onClick={() => router.push("/debateroom/experience")}
        >
          체험 토론
        </div>
      </div>
      <div className={`inner ${styles.inner_box}`}>
        <div className={styles.qna}>{"자주 묻는 질문"}</div>
        {CONTENTS.map((CONTENT, idx) => (
          <div className={styles.qna_box} key={CONTENT.title}>
            <div className={styles.title_box} onClick={() => handleOpen(idx)}>
              <div className={`${checkOpen(idx) ? styles.title_open : ""}`}>
                {CONTENT.title}
              </div>
              <div className={checkOpen(idx) ? styles.open : styles.close}>
                {checkOpen(idx) ? "▼" : "►"}
              </div>
            </div>
            <pre
              className={`${styles.detail} ${
                checkOpen(idx) ? styles.detail_open : ""
              }`}
            >
              {CONTENT.detail}
            </pre>
          </div>
        ))}
      </div>
    </div>
  );
}
