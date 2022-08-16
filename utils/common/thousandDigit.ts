//* 천 단위로 콤마(,) 찍기
export const thousandDigit = (num: number) => {
  const str = String(num);
  if (str.length <= 3) return str;
  return str
    .split("")
    .reverse()
    .map((el, idx) => {
      if (idx !== 0 && idx % 3 === 0) {
        return el + ",";
      }
      return el;
    })
    .reverse()
    .join("");
};
