import React, { useMemo } from "react";

import Checkbox from "@ui/Checkbox";
import Fieldset from "@ui/Fieldset";
import { TextField } from "@ui/TextField";
import classNames from "classnames";

import { QUESTION_TYPES_MAP } from "../Constuctor.config";

import type { TQuestionBaseProps, TQuestionProps } from "./Question.types";
import type { TQuestionType } from "@pages/Survey/Survey.types";

import styles from "./Question.module.scss";

import { Binary } from "./Binary";
import { DateQuestion } from "./Date";
import { Dropdown } from "./Dropdown";
import { Multi } from "./Multi";
import { Single } from "./Single";
import { Text } from "./Text";
import { Textarea } from "./Textarea";

const Question: React.FC<TQuestionBaseProps> = React.memo(
  ({ item, index, questionLength, onChange, onRemove, onMoveLeft, onMoveRight }) => {
    /** Текущий компонент вопроса */
    const QuestionComponent = useMemo(() => {
      const QUESTION_COMPONENTS: Record<TQuestionType, React.FC<TQuestionProps>> = {
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
      <Fieldset className={styles.question}>
        <header className={styles.question__header}>
          <div className={styles.question__actions}>
            <div className={styles.question__arrows}>
              {questionLength >= 2 && index !== 0 && (
                <span
                  tabIndex={0}
                  role="button"
                  className={classNames("icon-backward-arrow", styles.question__arrow)}
                  onClick={onMoveLeft}
                  onKeyDown={e => e.code === "Enter" && onMoveLeft}
                >
                  {"<"}
                </span>
              )}

              {questionLength >= 2 && index !== questionLength - 1 && (
                <span
                  tabIndex={0}
                  role="button"
                  className={classNames("icon-forward-arrow", styles.question__arrow)}
                  onClick={onMoveRight}
                  onKeyDown={e => e.code === "Enter" && onMoveRight}
                >
                  {">"}
                </span>
              )}
            </div>

            <span
              tabIndex={0}
              role="button"
              className={classNames("icon-trash", styles.question__remove)}
              onClick={onRemove}
              onKeyDown={e => e.code === "Enter" && onRemove}
            />
          </div>

          <div className={styles.question__head}>
            <span className={styles.question__title}>{QUESTION_TYPES_MAP[item.type]}</span>

            <Checkbox
              label="Обязательный вопрос"
              inputProps={{
                id: "question-required",
                checked: item.required,
                onChange: e => onChange({ required: e.target.checked }),
              }}
            />
          </div>
        </header>

        <div className={styles.question__body}>
          <TextField
            size="mobile"
            config={{
              labelProps: { value: "Заголовок" },
              inputProps: {
                value: item.title,
                onChange: e => onChange({ title: e.target.value }),
                required: true,
              },
            }}
          />

          <TextField
            type="textarea"
            size="mobile"
            config={{
              labelProps: { value: "Описание (опционально)" },
              textAreaProps: {
                value: item.description || "",
                className: styles.question__textarea,
                onChange: e => onChange({ description: e.target.value }),
              },
            }}
          />

          <div className={styles.options}>
            <QuestionComponent
              item={item}
              onChange={onChange}
              onRemove={onRemove}
              onMoveLeft={onMoveLeft}
              onMoveRight={onMoveRight}
            />
          </div>
        </div>
      </Fieldset>
    );
  }
);

Question.displayName = "Question";

export default Question;
