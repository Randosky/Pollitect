import React from "react";

import classNames from "classnames";

import type { TTextFieldProps } from "./TextField.types";

import styles from "./TextField.module.scss";

/**
 * Компонент поля ввода
 *
 * @prop {React.ReactElement | undefined} icon - иконка поля ввода
 * @prop {object | undefined} config - конфигурация поля ввода
 * @prop {TTextFieldType | undefined} type - тип поля ввода
 * @prop {string | undefined} size - размер поля ввода (desktop, mobile)
 * @prop {boolean | undefined} isError - флаг ошибки поля ввода
 * @prop {boolean | undefined} isDisabled - флаг блокировки поля ввода
 * @prop {boolean | undefined} showPassword - флаг показа пароля
 * @prop {React.ReactElement | undefined} customInputComponent - кастомный компонент поля ввода
 */
const TextField: React.FC<TTextFieldProps> = props => {
  const {
    icon,
    config,
    type = "input",
    size = "desktop",
    isError = false,
    isDisabled = false,
    showPassword = false,
    customInputComponent,
  } = props;

  const {
    labelProps: { value: labelValue, ...labelProps } = { value: "" },
    inputProps: { type: inputType, ...inputProps } = { type: "text" },
    textAreaProps,
    wrapperProps,
    containerProps,
  } = config || {};

  const [showPasswordLocal, changeShowPasswordLocal] = React.useReducer((state: boolean) => !state, false);

  return (
    <section
      data-error={isError}
      data-disabled={isDisabled}
      className={classNames(styles.container, styles[size])}
      {...containerProps}
    >
      {labelValue && (
        <label
          className={styles.label}
          {...labelProps}
        >
          {labelValue}
        </label>
      )}

      {customInputComponent ? (
        customInputComponent
      ) : (
        <div
          className={styles.inner}
          {...wrapperProps}
        >
          {icon}

          {type === "textarea" ? (
            <textarea
              className={styles.field}
              {...textAreaProps}
            />
          ) : (
            <input
              type={showPassword && !showPasswordLocal ? "password" : inputType}
              className={styles.field}
              {...inputProps}
            />
          )}

          {showPassword && (
            <button
              type="button"
              onClick={changeShowPasswordLocal}
              className={`icon-eye-${showPasswordLocal ? "opened" : "closed"}`}
            />
          )}
        </div>
      )}
    </section>
  );
};

export { TextField };
