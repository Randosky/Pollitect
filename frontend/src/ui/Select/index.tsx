import React, { useCallback, useState } from "react";

import classNames from "classnames";

import type { TSelectProps } from "./Select.types";

import styles from "./Select.module.scss";

const Select: React.FC<TSelectProps> = ({ value, onChange, children, size = "desktop", className, ...rest }) => {
  /* открыт ли нативный список опций */
  const [opened, setOpened] = useState(false);

  /* ставим «открыто» при клике мышью или пробел/enter */
  const handleMouseDown = () => setOpened(true);
  const handleKeyDown = useCallback((e: React.KeyboardEvent<HTMLSelectElement>) => {
    if (e.key === " " || e.key === "Enter") setOpened(true);

    if (e.key === "Escape") setOpened(false);
  }, []);

  /* убираем при потере фокуса — меню гарантированно закрыто */
  const handleBlur = () => setOpened(false);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOpened(false);
    onChange?.(e);
  };

  return (
    <div className={classNames(styles.selectWrapper, { [styles.opened]: opened })}>
      <select
        className={classNames(styles.select, styles[size], className)}
        value={value}
        onChange={handleChange}
        onMouseDown={handleMouseDown}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        {...rest}
      >
        {children}
      </select>
    </div>
  );
};

export default React.memo(Select);
