import React, { ReactNode } from "react";

/** Пропсы для container‑элемента fieldset */
export type TFieldsetContainerProps = React.DetailedHTMLProps<
  React.FieldsetHTMLAttributes<HTMLFieldSetElement>,
  HTMLFieldSetElement
>;

/** Пропсы для легенды fieldset */
export type TFieldsetLegendProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLLegendElement>, HTMLLegendElement>;

/** Основные пропсы Fieldset */
export type TFieldsetProps = {
  /** Текст легенды (можно опустить, если не нужна) */
  legend?: string;
  /** Дочерние элементы – любые React‑ноды */
  children: ReactNode;
  /** Доп. пропсы для элемента legend */
  legendProps?: TFieldsetLegendProps;
  /** Доп. пропсы для элемента fieldset */
  containerProps?: TFieldsetContainerProps;
};
