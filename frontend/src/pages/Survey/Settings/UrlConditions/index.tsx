import React, { useRef } from "react";

import Fieldset from "@ui/Fieldset";
import Radio from "@ui/Radio";
import { TextField } from "@ui/TextField";
import classNames from "classnames";

import styles from "./UrlConditions.module.scss";

type TUrlConditionsProps = {
  /**
   * Режим соответствия URL:
   *   - "contains" - содержит (нестрогое соответствие)
   *   - "equals" - равен (строгое соответствие)
   */
  mode: "contains" | "equals";
  /**
   * Массив URL, которые будут сравниваться с текущим URL.
   * Если режим "equals", то должен быть только один URL.
   */
  patterns: string[];
  /**
   * Изменяет режим соответствия URL.
   * @param mode новый режим
   */
  onModeChange(m: "contains" | "equals"): void;
  /**
   * Изменяет массив URL, которые будут сравниваться с текущим URL.
   * @param p новый массив URL
   */
  onPatternsChange(p: string[]): void;
};

const UrlConditions: React.FC<TUrlConditionsProps> = ({ mode, patterns, onModeChange, onPatternsChange }) => {
  /* сохранённые strict URL‑ы */
  const equalsPatterns = useRef<string[]>(patterns.length > 1 ? patterns : [""]);

  /**
   * Переключает между строгим и нестрогим режимом URL.
   * @param mode если "equals", берёт сохранённые строгие паттерны, иначе берёт первый паттерн и сохраняет остальные.
   */
  const handleSwitchMode = (mode: "contains" | "equals") => {
    if (mode === "equals") {
      onPatternsChange(equalsPatterns.current);
    } else {
      equalsPatterns.current = patterns.length ? patterns : [""];

      onPatternsChange([patterns[0] ?? ""]);
    }

    onModeChange(mode);
  };

  /**
   * Обновляет конкретный URL‑паттерн в стейте.
   * @param v новый URL‑паттерн.
   * @param i индекс, под которым лежит обновляемый паттерн.
   */
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
            name: "url-mode",
            checked: mode === "contains",
            onChange: () => handleSwitchMode("contains"),
          }}
        />

        <Radio
          label="Строгое совпадение"
          inputProps={{
            name: "url-mode",
            checked: mode === "equals",
            onChange: () => handleSwitchMode("equals"),
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
