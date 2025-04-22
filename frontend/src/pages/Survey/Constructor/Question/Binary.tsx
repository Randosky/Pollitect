import React from "react";

import type { QuestionItem } from "../Constructor.types";

import styles from "../Constructor.module.scss";

interface Props {
  item: QuestionItem;
  onChange: (f: Partial<QuestionItem>) => void;
}

const Binary: React.FC<Props> = ({ item, onChange }) => (
  <div className={styles.questionBlock}>
    <input
      className={styles.titleInput}
      value={item.title}
      placeholder="Заголовок бинарного вопроса"
      onChange={e => onChange({ title: e.target.value })}
      required
    />
    <textarea
      className={styles.descInput}
      value={item.description}
      placeholder="Описание (опционально)"
      onChange={e => onChange({ description: e.target.value })}
    />
    <div className={styles.binaryRow}>
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
  </div>
);

export default Binary;
