import React from "react";

import type { QuestionItem } from "../Constructor.types";

import styles from "../Constructor.module.scss";

interface Props {
  item: QuestionItem;
  onChange: (f: Partial<QuestionItem>) => void;
}

const Single: React.FC<Props> = ({ item, onChange }) => (
  <div className={styles.questionBlock}>
    <input
      className={styles.titleInput}
      value={item.title}
      placeholder="Заголовок вопроса"
      onChange={e => onChange({ title: e.target.value })}
      required
    />
    <textarea
      className={styles.descInput}
      value={item.description}
      placeholder="Описание (опционально)"
      onChange={e => onChange({ description: e.target.value })}
    />
    {item.options?.map((opt, i) => (
      <div
        key={i}
        className={styles.optionRow}
      >
        <input
          value={opt}
          placeholder={`Вариант ${i + 1}`}
          onChange={e => {
            const opts = [...(item.options || [])];

            opts[i] = e.target.value;
            onChange({ options: opts });
          }}
        />
        <button
          type="button"
          onClick={() => {
            const opts = [...(item.options || [])];

            opts.splice(i, 1);
            onChange({ options: opts });
          }}
        >
          −
        </button>
      </div>
    ))}
    <button
      className={styles.addOption}
      type="button"
      onClick={() => onChange({ options: [...(item.options || []), ""] })}
    >
      + Добавить вариант
    </button>
  </div>
);

export default Single;
