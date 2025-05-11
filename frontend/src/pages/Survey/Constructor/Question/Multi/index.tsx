import React from "react";

import Button from "@ui/Button";
import Checkbox from "@ui/Checkbox";
import { TextField } from "@ui/TextField";
import classNames from "classnames";

import type { TQuestionProps } from "../Question.types";

import styles from "../Question.module.scss";

export const Multi: React.FC<TQuestionProps> = ({ item, onChange }) => {
  const opts = item.options || [];

  const handleOptionChange = (index: number, value: string) => {
    const newOpts = [...opts];

    newOpts[index] = value;
    onChange({ options: newOpts });
  };

  const handleRemove = (index: number) => {
    const newOpts = opts.filter((_, i) => i !== index);

    onChange({ options: newOpts });
  };

  const handleAdd = () => {
    onChange({ options: [...opts, ""] });
  };

  return (
    <>
      {/* Сетка опций */}
      <div className={styles["question-options"]}>
        {opts.map((opt, i) => (
          <div
            key={i}
            className={styles.optionRow}
          >
            <Checkbox
              label=""
              size="mobile"
              className={styles.checkbox}
              inputProps={{ id: `option-${i}`, disabled: true }}
            />

            <TextField
              size="mobile"
              config={{
                containerProps: { className: styles.optionInput },
                inputProps: {
                  value: opt,
                  placeholder: `Вариант ${i + 1}`,
                  onChange: e => handleOptionChange(i, e.target.value),
                },
              }}
            />

            <span
              tabIndex={0}
              role="button"
              className={classNames("icon-cross", styles.removeOption)}
              onClick={() => handleRemove(i)}
              onKeyDown={e => e.code === "Enter" && handleRemove(i)}
            />
          </div>
        ))}
      </div>

      <Button
        variant="primary"
        onClick={handleAdd}
        className={styles.addOption}
      >
        + Добавить
      </Button>
    </>
  );
};
