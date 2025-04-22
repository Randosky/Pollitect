import React from "react";

import type { TQuestion } from "@pages/Survey/Survey.types";

import styles from "./Question.module.scss";

interface Props {
  item: TQuestion;
  onChange: (upd: Partial<TQuestion>) => void;
  children: React.ReactNode;
}

export const BaseQuestion: React.FC<Props> = ({ item, onChange, children }) => (
  <div className={styles.questionBlock}>
    <div className={styles.row}>
      <input
        className={styles.titleInput}
        value={item.title}
        placeholder="Заголовок"
        onChange={e => onChange({ title: e.target.value })}
        required
      />
      <label>
        <input
          type="checkbox"
          checked={item.required}
          onChange={e => onChange({ required: e.target.checked })}
        />{" "}
        Обязательно
      </label>
    </div>
    <textarea
      className={styles.descInput}
      value={item.description}
      placeholder="Описание (опционально)"
      onChange={e => onChange({ description: e.target.value })}
    />
    {children}
  </div>
);
