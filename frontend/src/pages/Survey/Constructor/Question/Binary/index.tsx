import React from "react";

import Radio from "@ui/Radio";

import type { TQuestionProps } from "../Question.types";

import styles from "../Question.module.scss";

export const Binary: React.FC<TQuestionProps> = () => {
  const [yesNo, setYesNo] = React.useState<"yes" | "no">();

  return (
    <div className={styles["question-options"]}>
      <Radio
        label="Да"
        inputProps={{
          name: "binary-question",
          checked: yesNo === "yes",
          onChange: () => setYesNo("yes"),
        }}
      />

      <Radio
        label="Нет"
        inputProps={{
          name: "binary-question",
          checked: yesNo === "no",
          onChange: () => setYesNo("no"),
        }}
      />
    </div>
  );
};
