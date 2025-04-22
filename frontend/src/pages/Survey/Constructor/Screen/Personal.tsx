import React from "react";

import type { QuestionItem } from "../Constructor.types";

import styles from "../Constructor.module.scss";

interface Props {
  item: QuestionItem;
  onChange: (f: Partial<QuestionItem>) => void;
}

const Personal: React.FC<Props> = ({ item, onChange }) => (
  <div className={styles.questionBlock}>
    <input
      className={styles.titleInput}
      value={item.title}
      placeholder="Заголовок сбора данных"
      onChange={e => onChange({ title: e.target.value })}
      required
    />
    <textarea
      className={styles.descInput}
      value={item.description}
      placeholder="Описание (согласие и пояснения)"
      onChange={e => onChange({ description: e.target.value })}
    />
    <div className={styles.personalFields}>
      {["Имя", "Email", "Телефон", "Адрес"].map((field, i) => (
        <label key={i}>
          <input
            type="checkbox"
            defaultChecked
          />
          {field}
        </label>
      ))}
    </div>
  </div>
);

export default Personal;
