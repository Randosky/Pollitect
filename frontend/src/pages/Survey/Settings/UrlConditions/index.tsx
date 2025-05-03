import React from "react";

import Fieldset from "@ui/Fieldset";
import Radio from "@ui/Radio";
import { TextField } from "@ui/TextField";
import classNames from "classnames";

import styles from "./UrlConditions.module.scss";

type Props = {
  mode: "contains" | "equals";
  patterns: string[];
  onModeChange(m: "contains" | "equals"): void;
  onPatternsChange(p: string[]): void;
};

const UrlConditions: React.FC<Props> = ({ mode, patterns, onModeChange, onPatternsChange }) => {
  const setPattern = (v: string, i: number) => {
    const p = [...patterns];

    p[i] = v;
    onPatternsChange(p);
  };

  const add = () => onPatternsChange([...patterns, ""]);
  const remove = (i: number) => onPatternsChange(patterns.filter((_, j) => j !== i));

  return (
    <Fieldset legend="Показ по URL">
      <div className={styles.modes}>
        <Radio
          label="Содержит"
          inputProps={{
            name: "url-mode-contains",
            checked: mode === "contains",
            onChange: () => onModeChange("contains"),
          }}
        />

        <Radio
          label="Строгое совпадение"
          inputProps={{
            name: "url-mode-equals",
            checked: mode === "equals",
            onChange: () => onModeChange("equals"),
          }}
        />
      </div>

      <div className={styles.list}>
        {patterns.map((p, i) => (
          <div
            key={i}
            className={styles.item}
          >
            <TextField
              size="mobile"
              config={{
                inputProps: {
                  placeholder: "https://example.com/page",
                  value: p,
                  onChange: e => setPattern(e.target.value, i),
                },
              }}
            />
            {mode === "equals" && (
              <button
                type="button"
                className={styles.remove}
                onClick={() => remove(i)}
              >
                <span className={classNames("icon-trash", styles.remove__icon)} />
              </button>
            )}
          </div>
        ))}

        {mode === "equals" && (
          <button
            type="button"
            className={styles.add}
            onClick={add}
          >
            + Добавить
          </button>
        )}
      </div>
    </Fieldset>
  );
};

export default React.memo(UrlConditions);
