import { Dispatch, SetStateAction } from "react";

export default function CheckBox({
  candidates,
  list,
  setList,
}: {
  candidates: string[];
  list: string[];
  setList: Dispatch<SetStateAction<string[]>>;
}) {
  return (
    <div>
      <div>{`${list}`}</div>
      {candidates.map((candidate) => {
        const selected = list.includes(candidate);
        return (
          <button
            key={candidate}
            onClick={() => {
              if (!list.includes(candidate)) {
                setList([...list, candidate]);
              } else {
                setList(list.filter((el) => el !== candidate));
              }
            }}
          >
            {candidate} {`${selected}`}
          </button>
        );
      })}
      <button onClick={() => setList([])}>X</button>
      <button onClick={() => setList([...candidates])}>V</button>
    </div>
  );
}
