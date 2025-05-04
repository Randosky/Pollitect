import React from "react";

export type TSelectSize = "mobile" | "desktop";

export type TSelectProps = Omit<
  React.DetailedHTMLProps<React.SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>,
  "size"
> & {
  /** Размер (меняет высоту и padding) */
  size?: TSelectSize;
};
