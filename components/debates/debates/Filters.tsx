import { Dispatch, SetStateAction } from "react";

import styles from "./Filters.module.scss";

import { CATEGORIES, STATUSES } from "../../../utils/common/constant";

export default function Filters({
  statuses,
  setStatuses,
  categories,
  setCategories,
}: {
  statuses: string[];
  setStatuses: Dispatch<SetStateAction<string[]>>;
  categories: string[];
  setCategories: Dispatch<SetStateAction<string[]>>;
}) {
  return (
    <div className={styles.outer}>
      <div className={styles.container}>
        {STATUSES.map((status) => {
          const selected = statuses.includes(status);
          return (
            <div
              className={`${styles.btn} ${
                selected ? styles.btn_status_selected : styles.btn_status
              }`}
              key={status}
              onClick={() => {
                if (!statuses.includes(status)) {
                  setStatuses([...statuses, status]);
                } else {
                  setStatuses(statuses.filter((el) => el !== status));
                }
              }}
            >
              {status}
            </div>
          );
        })}
      </div>
      <div className={styles.container}>
        {CATEGORIES.map((category) => {
          const selected = categories.includes(category);
          return (
            <div
              className={`${styles.btn} ${
                selected ? styles.btn_category_selected : styles.btn_category
              }`}
              key={category}
              onClick={() => {
                if (!categories.includes(category)) {
                  setCategories([...categories, category]);
                } else {
                  setCategories(categories.filter((el) => el !== category));
                }
              }}
            >
              {category}
            </div>
          );
        })}
      </div>
      <div className={styles.container}>
        <div
          className={`${styles.btn} ${styles.btn_all} ${styles.btn_all_cancel}`}
          onClick={() => {
            setStatuses([]);
            setCategories([]);
          }}
        >
          선택 해제
        </div>
        <div
          className={`${styles.btn} ${styles.btn_all} ${styles.btn_all_check}`}
          onClick={() => {
            setStatuses([...STATUSES]);
            setCategories([...CATEGORIES]);
          }}
        >
          전체 선택
        </div>
      </div>
    </div>
  );
}
