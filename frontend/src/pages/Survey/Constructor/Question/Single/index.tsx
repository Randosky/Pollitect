import React from "react";

import type { TQuestionProps } from "../Question.types";

import styles from "../Question.module.scss";

export const Single: React.FC<TQuestionProps> = ({ item, onChange }) => (
  <>
    {(item.options || []).map((opt, i) => (
      <div
        key={i}
        className={styles.optionRow}
      >
        <input
          type="radio"
          disabled
        />
        <input
          className={styles.optionInput}
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
  </>
);
