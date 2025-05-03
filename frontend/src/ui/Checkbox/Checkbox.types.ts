import React from "react";

/** Размеры чекбокса */
export type TCheckboxSize = "mobile" | "desktop";

/** Пропсы для input checkbox */
export type TCheckboxInputProps = React.DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

/** Пропсы для span‑подписи */
export type TCheckboxLabelProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLSpanElement>, HTMLSpanElement>;

/** Пропсы для внешнего контейнера (label) */
export type TCheckboxContainerProps = React.DetailedHTMLProps<
  React.LabelHTMLAttributes<HTMLLabelElement>,
  HTMLLabelElement
>;

/** Основные пропсы Checkbox */
export type TCheckboxProps = {
  /** Текст подписи */
  label: string;
  /** Размер (desktop / mobile) */
  size?: TCheckboxSize;
  /** Доп. класс */
  className?: string;

  /** Доп. пропсы */
  containerProps?: TCheckboxContainerProps;
  inputProps?: TCheckboxInputProps & { id: string };
  labelProps?: TCheckboxLabelProps;
};
