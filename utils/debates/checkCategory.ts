export const checkCategory = (list: string[], category: string) => {
  if (list.length === 0) {
    return true;
  } else {
    return list.includes(category);
  }
};
