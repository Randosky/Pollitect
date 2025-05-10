import React from "react";

import Radio from "@ui/Radio";

import type { IQuestionProps } from "../Question.types";

import styles from "../Question.module.scss";

export const Binary: React.FC<IQuestionProps> = () => {
  const [yesNo, setYesNo] = React.useState<"yes" | "no">();

  return (
    <div className={styles.row}>
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
