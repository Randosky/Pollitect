import React from "react";

import type { IQuestionProps } from "../Questions.types";

import styles from "../Question.module.scss";

export const Binary: React.FC<IQuestionProps> = () => (
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
);
