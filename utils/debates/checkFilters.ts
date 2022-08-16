//* 상태 및 카테고리의 선택 여부와 포함여부 판단
export const checkFilters = (
  statuses: string[],
  status: string,
  categories: string[],
  category: string,
) => {
  if (statuses.length === 0 && categories.length === 0) {
    return true;
  } else if (statuses.length !== 0 && categories.length === 0) {
    return statuses.includes(status);
  } else if (statuses.length === 0 && categories.length !== 0) {
    return categories.includes(category);
  } else if (statuses.length !== 0 && categories.length !== 0) {
    return statuses.includes(status) && categories.includes(category);
  }
};
