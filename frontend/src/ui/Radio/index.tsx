import React from "react";

import classNames from "classnames";

import type { TRadioProps } from "./Radio.types";

import styles from "./Radio.module.scss";

/** Кастомная радио‑кнопка */
const Radio: React.FC<TRadioProps> = ({
  label,
  size = "desktop",
  className,
  containerProps,
  inputProps = {},
  labelProps,
}) => (
  <label
    className={classNames(styles.radio, styles[size], className)}
    {...containerProps}
  >
    <input
      type="radio"
      {...inputProps}
    />
    <span className={styles.fake} />
    <span
      className={styles.text}
      {...labelProps}
    >
      {label}
    </span>
  </label>
);

export default React.memo(Radio);
