import React from "react";

import { TextField } from "@ui/TextField";

import type { TQuestionProps } from "../Question.types";

import styles from "../Question.module.scss";

export const Text: React.FC<TQuestionProps> = () => (
  <TextField
    size="mobile"
    config={{
      containerProps: { className: styles.optionInput },
      inputProps: {
        disabled: true,
        placeholder: "Поле, отображаемое в виджете",
      },
    }}
  />
);
