import React from "react";

import type { IQuestionProps } from "../Question.types";

import styles from "../Question.module.scss";

export const DateQuestion: React.FC<IQuestionProps> = () => (
  <input
    className={styles.responseInput}
    type="date"
    disabled
  />
);
