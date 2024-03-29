const months = [
  "JAN",
  "FEB",
  "MAR",
  "APR",
  "MAY",
  "JUN",
  "JUL",
  "AUG",
  "SEP",
  "OCT",
  "NOV",
  "DEC",
];
const isValidDate = (date: Date) => {
  return typeof date === "object" && date !== null && "getDate" in date;
};

//> ex. 23 Sep 1994
function DMY(strDate: string) {
  const date = new Date(strDate);
  if (isValidDate(date)) {
    const formatted_date = `${date.getDate()} ${
      months[date.getMonth()]
    } ${date.getFullYear()}`;
    return formatted_date;
  }
  return "";
}

//> ex. 23 Sep 1994 13:23
function DMYHM(strDate: string) {
  const date = new Date(strDate);
  if (isValidDate(date)) {
    let min = String(date.getMinutes());
    if (String(min).length < 2) {
      min = `0${min}`;
    }
    const formatted_date = `${date.getDate()} ${
      months[date.getMonth()]
    } ${date.getFullYear()} ${date.getHours()}:${min}`;
    return formatted_date;
  }
  return "";
}

//> ex. 23 Sep 1994 or 13:23
function DMYorHM(strDate: string) {
  const date = new Date(strDate);
  if (isValidDate(date)) {
    const curDate = new Date();
    const formatted_curDate = `${curDate.getDate()} ${
      months[curDate.getMonth()]
    } ${curDate.getFullYear()}`;
    const formatted_date = `${date.getDate()} ${
      months[date.getMonth()]
    } ${date.getFullYear()}`;
    if (formatted_curDate === formatted_date) {
      let min = String(date.getMinutes());
      if (String(min).length === 1) {
        min = `0${min}`;
      }
      return `오늘 ${date.getHours()}:${min}`;
    } else {
      return formatted_date;
    }
  }
  return "";
}

export { DMY, DMYHM, DMYorHM };
