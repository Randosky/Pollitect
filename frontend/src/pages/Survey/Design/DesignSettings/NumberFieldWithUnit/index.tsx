/* eslint-disable camelcase */
import React, { useCallback } from "react";

import Select from "@ui/Select";
import { TextField } from "@ui/TextField";

import type { TUnit } from "@pages/Survey/Survey.types";

import styles from "../DesignSettings.module.scss";

const MAX_PERCENT = 100;

type TProps = {
  value: number;
  unit: TUnit;
  onChange: (num: number, u: TUnit) => void;
  id?: string;
  placeholder?: string;
  size?: "mobile" | "desktop";
};

/** Инпут «число + единицы» с автокоррекцией значений. */
const NumberFieldWithUnit: React.FC<TProps> = ({ value, unit, onChange, id, placeholder, size = "mobile" }) => {
  /* ───────── blur: правим отрицательные и >100 для % ───────── */
  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement>) => {
      let v = +e.currentTarget.value;

      if (v < 0) v = 0;

      if (unit === "%" && v > MAX_PERCENT) v = MAX_PERCENT;

      if (v !== value) onChange(v, unit);
    },
    [unit, value, onChange]
  );

  /* ───────── смена юнита ───────── */
  const handleUnitChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      const newUnit = e.target.value as TUnit;
      let newVal = value;

      /* px → % : обрезаем до 100 */
      if (newUnit === "%" && value > MAX_PERCENT) newVal = MAX_PERCENT;

      onChange(newVal, newUnit);
    },
    [value, onChange]
  );

  /**
   * Обработчик события изменения инпута.
   * Использует `getNumberValue` для парсинга значений.
   * @param e - событие изменения.
   * @returns {void}
   */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    let v = +e.target.value;

    e.currentTarget.value = v.toString();

    if (unit === "%" && v > MAX_PERCENT) v = MAX_PERCENT;

    onChange(v, unit);
  };

  return (
    <>
      <TextField
        size={size}
        config={{
          inputProps: {
            id,
            placeholder,
            value,
            type: "number",
            onChange: handleChange,
            onBlur: handleBlur,
          },
        }}
      >
        <span className={styles.hint}>{unit}</span>
      </TextField>

      <Select
        size={size}
        value={unit}
        onChange={handleUnitChange}
      >
        <option value="%">%</option>
        <option value="px">px</option>
      </Select>
    </>
  );
};

export default React.memo(NumberFieldWithUnit);
