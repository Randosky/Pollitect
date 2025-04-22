import React from "react";

import type { TQuestion } from "@pages/Survey/Survey.types";

import styles from "../Question.module.scss";

import { BaseQuestion } from "../Base";

export const Text: React.FC<{
  item: TQuestion;
  onChange: (upd: Partial<TQuestion>) => void;
}> = ({ item, onChange }) => (
  <BaseQuestion
    item={item}
    onChange={onChange}
  >
    <input
      className={styles.responseInput}
      type="text"
      placeholder="Текстовый ответ"
      disabled
    />
  </BaseQuestion>
);
