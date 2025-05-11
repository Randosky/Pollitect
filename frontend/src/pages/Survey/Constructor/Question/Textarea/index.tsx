import React from "react";

import { TextField } from "@ui/TextField";

import type { TQuestionProps } from "../Question.types";

import styles from "../Question.module.scss";

export const Textarea: React.FC<TQuestionProps> = () => (
  <TextField
    type="textarea"
    size="mobile"
    config={{
      containerProps: { className: styles.optionInput },
      textAreaProps: {
        disabled: true,
        placeholder: "Поле, отображаемое в виджете",
      },
    }}
  />
);
