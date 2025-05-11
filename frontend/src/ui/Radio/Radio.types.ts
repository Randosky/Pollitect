import React from "react";

export type TRadioProps = {
  /** подпись справа от метки */
  label?: string;
  /** desktop / mobile */
  size?: "desktop" | "mobile";
  /** кастомные классы враппера */
  className?: string;
  /** пропсы корневого label */
  containerProps?: React.DetailedHTMLProps<React.LabelHTMLAttributes<HTMLLabelElement>, HTMLLabelElement>;
  /** пропсы нативного input[type=radio] */
  inputProps?: React.DetailedHTMLProps<React.InputHTMLAttributes<HTMLInputElement>, HTMLInputElement> & {
    id?: string;
  };
  /** пропсы span‑подписи */
  labelProps?: React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;
};
