import React from "react";

import type { TQuestionProps } from "../Question.types";

import styles from "../Question.module.scss";

export const Textarea: React.FC<TQuestionProps> = () => (
  <textarea
    className={styles.responseTextarea}
    placeholder="Многострочный ответ"
    disabled
  />
);
