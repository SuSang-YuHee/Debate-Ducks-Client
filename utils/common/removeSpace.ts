//> 2칸 이상의 공백과 2줄 이상의 개행 제거
export const removeSpace = (str: string) => {
  return str
    .replace(/\n/g, `\0`)
    .replace(/\s{2,}/g, " ")
    .replace(/^\s|\s$/gm, "")
    .replace(/\0/g, `\n`)
    .replace(/\n /g, `\n`)
    .replace(/ \n/g, `\n`)
    .replace(/\n{3,}/g, `\n\n`);
};
