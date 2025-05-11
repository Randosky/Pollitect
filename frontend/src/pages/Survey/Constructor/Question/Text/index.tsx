import React from "react";

import type { TQuestionProps } from "../Question.types";

import styles from "../Question.module.scss";

export const Text: React.FC<TQuestionProps> = () => (
  <input
    className={styles.responseInput}
    type="text"
    placeholder="Текстовый ответ"
    disabled
  />
);
