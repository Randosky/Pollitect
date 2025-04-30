/* eslint-disable camelcase */
import React, { useState } from "react";

import type { TIndents } from "@pages/Survey/Survey.types";

import styles from "../DesignSettings.module.scss";

type TIndentsEditorProps = {
  label: string;
  value: TIndents;
  onChange: (val: TIndents) => void;
};

const IndentsEditor: React.FC<TIndentsEditorProps> = ({ label, value, onChange }) => {
  const [mode, setMode] = useState<"one" | "two" | "four">("one");

  const handleChange = (index: number, newValue: number) => {
    const updated = [...value] as TIndents;

    updated[index] = newValue;
    onChange(updated);
  };

  const renderFields = () => {
    switch (mode) {
      case "one":
        return (
          <input
            type="number"
            value={value[0]}
            onChange={e => onChange(Array(4).fill(+e.target.value) as TIndents)}
          />
        );

      case "two":
        return (
          <>
            <input
              type="number"
              placeholder="Top/Bottom"
              value={value[0]}
              onChange={e => onChange([+e.target.value, value[1], +e.target.value, value[3]] as TIndents)}
            />
            <input
              type="number"
              placeholder="Left/Right"
              value={value[1]}
              onChange={e => onChange([value[0], +e.target.value, value[2], +e.target.value] as TIndents)}
            />
          </>
        );

      case "four":
        return (
          <>
            <input
              type="number"
              placeholder="Top"
              value={value[0]}
              onChange={e => handleChange(0, +e.target.value)}
            />
            <input
              type="number"
              placeholder="Right"
              value={value[1]}
              onChange={e => handleChange(1, +e.target.value)}
            />
            <input
              type="number"
              placeholder="Bottom"
              value={value[2]}
              onChange={e => handleChange(2, +e.target.value)}
            />
            <input
              type="number"
              placeholder="Left"
              value={value[3]}
              onChange={e => handleChange(3, +e.target.value)}
            />
          </>
        );
    }
  };

  return (
    <fieldset className={styles.group}>
      <legend className={styles.legend}>
        {label}
        <select
          className={styles.select}
          value={mode}
          onChange={e => setMode(e.target.value as "one" | "two" | "four")}
        >
          <option value="one">1</option>
          <option value="two">2</option>
          <option value="four">4</option>
        </select>
      </legend>
      <div className={styles.row}>{renderFields()}</div>
    </fieldset>
  );
};

export default IndentsEditor;
