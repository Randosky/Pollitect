import React from "react";

import type { TQuestion } from "@pages/Survey/Survey.types";

import styles from "../Question.module.scss";

import { BaseQuestion } from "../Base";

export const Dropdown: React.FC<{
  item: TQuestion;
  onChange: (upd: Partial<TQuestion>) => void;
}> = ({ item, onChange }) => (
  <BaseQuestion
    item={item}
    onChange={onChange}
  >
    <select
      className={styles.selectInput}
      disabled
    >
      <option>Выберите вариант</option>
    </select>
    {(item.options || []).map((opt, i) => (
      <div
        key={i}
        className={styles.optionRow}
      >
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
  </BaseQuestion>
);
