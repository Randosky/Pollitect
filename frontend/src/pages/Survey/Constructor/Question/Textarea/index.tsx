import React from "react";

import type { IQuestionProps } from "../Questions.types";

import styles from "../Question.module.scss";

export const Textarea: React.FC<IQuestionProps> = () => (
  <textarea
    className={styles.responseTextarea}
    placeholder="Многострочный ответ"
    disabled
  />
);
