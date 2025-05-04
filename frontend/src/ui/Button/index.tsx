import React from "react";

import classNames from "classnames";

import type { TButtonProps } from "./Button.types";

import styles from "./Button.module.scss";

/** Универсальная кнопка для интерфейса (вопросы, модалки, формы и т.д.) */
const Button: React.FC<TButtonProps> = ({ variant = "primary", disabled, className, children, ...rest }) => (
  <button
    {...rest}
    disabled={disabled}
    className={classNames(styles.btn, styles[variant], className)}
  >
    {children}
  </button>
);

export default React.memo(Button);
