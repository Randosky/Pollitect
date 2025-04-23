import React, { PropsWithChildren } from "react";

import { IQuestionProps } from "./Questions.types";

import styles from "./Question.module.scss";

const Question: React.FC<PropsWithChildren<IQuestionProps>> = ({ item, onChange, children }) => (
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

export default Question;
