import React from "react";

import classNames from "classnames";

import type { TCheckboxProps } from "./Checkbox.types";

import styles from "./Checkbox.module.scss";

/**
 * Универсальный чекбокс с подписью.
 *
 * ```tsx
 * <Checkbox
 *   label="Блокировать прокрутку"
 *   checked={blockScroll}
 *   onChange={e => onChange({ block_scroll: e.target.checked })}
 * />
 * ```
 */
const Checkbox: React.FC<TCheckboxProps> = ({
  label,
  size = "desktop",
  className,
  containerProps,
  inputProps,
  labelProps = {},
}) => (
  <label
    className={classNames(styles.checkbox, styles[size], className)}
    {...containerProps}
  >
    <input
      type="checkbox"
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

export default React.memo(Checkbox);
