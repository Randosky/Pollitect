import React, { useMemo } from "react";

import { IQuestionProps } from "./Question.types";
import type { TQuestionType } from "@pages/Survey/Survey.types";

import styles from "./Question.module.scss";

import { Binary } from "./Binary";
import { DateQuestion } from "./Date";
import { Dropdown } from "./Dropdown";
import { Multi } from "./Multi";
import { Single } from "./Single";
import { Text } from "./Text";
import { Textarea } from "./Textarea";

const Question: React.FC<IQuestionProps> = React.memo(({ item, onChange }) => {
  const QuestionComponent = useMemo(() => {
    const QUESTION_COMPONENTS: Record<TQuestionType, React.FC<IQuestionProps>> = {
      single: Single,
      multi: Multi,
      binary: Binary,
      dropdown: Dropdown,
      text: Text,
      textarea: Textarea,
      date: DateQuestion,
    };

    return QUESTION_COMPONENTS[item.type];
  }, [item.type]);

  return (
    <div className={styles.question}>
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
        value={item.description || ""}
        placeholder="Описание (опционально)"
        onChange={e => onChange({ description: e.target.value })}
      />
      <div className={styles.options}>
        <QuestionComponent
          item={item}
          onChange={onChange}
        />
      </div>
    </div>
  );
});

Question.displayName = "Question";

export default Question;
