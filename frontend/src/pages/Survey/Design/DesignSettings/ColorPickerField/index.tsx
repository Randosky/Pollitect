import React from "react";

import { TextField } from "@ui/TextField";
import classNames from "classnames";

import styles from "../DesignSettings.module.scss";

type TColorPickerFieldProps = {
  /** label слева */
  label: string;
  /** текущее значение */
  value: string;
  /** колбэк изменения */
  onChange: (v: string) => void;
  /** id input (опц.) */
  id?: string;
};

/** Однострочный «label + input[type=color]» c TextField‑обёрткой */
const ColorPickerField: React.FC<TColorPickerFieldProps> = ({ label, value, onChange, id }) => (
  <TextField
    size="mobile"
    config={{
      containerProps: { className: classNames(styles.row, styles.colors__container) },
      labelProps: { className: styles.colors__label, value: label },
      inputProps: {
        id,
        type: "color",
        value,
        onChange: e => onChange(e.target.value),
      },
    }}
  />
);

export default React.memo(ColorPickerField);
