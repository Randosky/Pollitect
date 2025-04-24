import React from "react";

import type { IQuestionProps } from "../Question.types";

import styles from "../Question.module.scss";

export const Text: React.FC<IQuestionProps> = () => (
  <input
    className={styles.responseInput}
    type="text"
    placeholder="Текстовый ответ"
    disabled
  />
);
