import React from "react";

import type { TQuestion } from "@pages/Survey/Survey.types";

import styles from "../Question.module.scss";

import { BaseQuestion } from "../Base";

export const Textarea: React.FC<{
  item: TQuestion;
  onChange: (upd: Partial<TQuestion>) => void;
}> = ({ item, onChange }) => (
  <BaseQuestion
    item={item}
    onChange={onChange}
  >
    <textarea
      className={styles.responseTextarea}
      placeholder="Многострочный ответ"
      disabled
    />
  </BaseQuestion>
);
