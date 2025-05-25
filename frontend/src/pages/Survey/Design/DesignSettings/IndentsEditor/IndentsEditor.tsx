import React, { useMemo, useState } from "react";

import Select from "@ui/Select";
import { TextField } from "@ui/TextField";

import type { TIndents } from "@pages/Survey/Survey.types";

import styles from "../DesignSettings.module.scss";

type TIndentsEditorProps = {
  isBorder?: boolean;
  label: string;
  value: TIndents;
  onChange: (val: TIndents) => void;
};

type TPosition = "Top" | "Right" | "Bottom" | "Left";

const POSITIONS: TPosition[] = ["Top", "Right", "Bottom", "Left"];
const POSITION_MAP: Record<TPosition, string> = { Top: "Сверху", Right: "Справа", Bottom: "Снизу", Left: "Слева" };
const POSITION_BORDER_MAP: Record<TPosition, string> = {
  Top: "Слева-сверху",
  Right: "Справа-сверху",
  Bottom: "Справа-снизу",
  Left: "Слева-снизу",
};

const IndentsEditor: React.FC<TIndentsEditorProps> = ({ isBorder, label, value, onChange }) => {
  const [mode, setMode] = useState<"one" | "two" | "four">("one");

  /** единое значение */
  const handleSingle = (v: number) => onChange([v, v, v, v]);

  /** два значения (TB / LR) */
  const handleDouble = (vTB: number, vLR: number) => onChange([vTB, vLR, vTB, vLR]);

  /** изменения в режиме «четыре» */
  const handleQuad = (i: number, v: number) => {
    const updated: TIndents = [...value];

    updated[i] = v;
    onChange(updated);
  };

  const cleaner = (cb: (v: number) => void) => (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = +e.currentTarget.value;

    e.currentTarget.value = v.toString();

    cb(v);
  };

  /** генерируем JSX‑поля под выбранный режим */
  const inputs = useMemo(() => {
    switch (mode) {
      case "one":
        return (
          <TextField
            size="mobile"
            config={{
              inputProps: {
                id: `${label}-one`,
                type: "number",
                value: value[0],
                onChange: cleaner(v => handleSingle(v)),
              },
            }}
          >
            <span className={styles.hint}>px</span>
          </TextField>
        );

      case "two":
        return (
          <>
            <TextField
              size="mobile"
              config={{
                inputProps: {
                  id: `${label}-tb`,
                  type: "number",
                  placeholder: "Top / Bottom",
                  value: value[0],
                  onChange: cleaner(v => handleDouble(v, value[1])),
                },
              }}
            >
              <span className={styles.hint}>px</span>
            </TextField>

            <TextField
              size="mobile"
              config={{
                inputProps: {
                  id: `${label}-lr`,
                  type: "number",
                  placeholder: "Left / Right",
                  value: value[1],
                  onChange: cleaner(v => handleDouble(value[0], v)),
                },
              }}
            >
              <span className={styles.hint}>px</span>
            </TextField>
          </>
        );

      default:
        return (
          <>
            {POSITIONS.map((p, i) => (
              <TextField
                key={p}
                size="mobile"
                config={{
                  labelProps: { value: isBorder ? POSITION_BORDER_MAP[p] : POSITION_MAP[p] },
                  inputProps: {
                    id: `${label}-${p.toLowerCase()}`,
                    type: "number",
                    placeholder: p,
                    value: value[i],
                    onChange: cleaner(v => handleQuad(i, v)),
                  },
                }}
              >
                <span className={styles.hint}> px</span>
              </TextField>
            ))}
          </>
        );
    }
  }, [mode, value]);

  return (
    <section className={styles.indents}>
      <div className={styles.block}>
        <span className={styles.label}>{label}</span>

        <Select
          size="mobile"
          value={mode}
          onChange={e => setMode(e.target.value as "one" | "two" | "four")}
        >
          <option value="one">Один для всех</option>
          {!isBorder && <option value="two">Верх/низ и бока</option>}
          <option value="four">Каждая сторона</option>
        </Select>
      </div>

      <div className={styles.row}>{inputs}</div>
    </section>
  );
};

export default React.memo(IndentsEditor);
