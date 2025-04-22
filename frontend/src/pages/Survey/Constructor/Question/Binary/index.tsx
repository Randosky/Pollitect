import React from "react";

import type { TQuestion } from "@pages/Survey/Survey.types";

import styles from "../Question.module.scss";

import { BaseQuestion } from "../Base";

export const Binary: React.FC<{
  item: TQuestion;
  onChange: (upd: Partial<TQuestion>) => void;
}> = ({ item, onChange }) => (
  <BaseQuestion
    item={item}
    onChange={onChange}
  >
    <div className={styles.row}>
      <label>
        <input
          type="radio"
          disabled
        />{" "}
        Да
      </label>
      <label>
        <input
          type="radio"
          disabled
        />{" "}
        Нет
      </label>
    </div>
  </BaseQuestion>
);
