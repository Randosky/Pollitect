// src/ui/Fieldset/Fieldset.tsx
import React from "react";

import classNames from "classnames";

import type { TFieldsetProps } from "./Fieldset.types";

import styles from "./Fieldset.module.scss";

/**
 * Универсальный блок‑обёртка для настроек.
 *
 * Пример использования:
 * ```tsx
 * <Fieldset legend="Флаги поведения">
 *   <label className={styles.checkbox}>
 *     <input type="checkbox" {...props} /> Блокировать прокрутку
 *   </label>
 * </Fieldset>
 * ```
 */
const Fieldset: React.FC<TFieldsetProps> = ({ legend, legendProps, className, children, containerProps }) => {
  return (
    <fieldset
      {...containerProps}
      className={classNames(styles.fieldset, className)}
    >
      {legend && (
        <legend
          className={styles.legend}
          {...legendProps}
        >
          {legend}
        </legend>
      )}
      {children}
    </fieldset>
  );
};

export default React.memo(Fieldset);
