import React, { PropsWithChildren } from "react";

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
 * @prop {React.ReactElement | undefined} customInputComponent - кастомный компонент поля ввода
 */
const TextField: React.FC<PropsWithChildren<TTextFieldProps>> = props => {
  const {
    icon,
    config,
    children,
    type = "input",
    size = "desktop",
    isError = false,
    isDisabled = false,
    customInputComponent,
  } = props;

  const {
    labelProps: { value: labelValue, className: labelCn, ...labelProps } = { value: "" },
    inputProps: { type: inputType, className: inputCn, ...inputProps } = { type: "text" },
    textAreaProps: { className: textAreaCn, ...textAreaProps } = {},
    wrapperProps: { className: wrapperCn, ...wrapperProps } = {},
    containerProps: { className: containerCn, ...containerProps } = {},
  } = config || {};

  const showPassword = inputType === "password";

  const [showPasswordLocal, changeShowPasswordLocal] = React.useReducer((state: boolean) => !state, false);

  return (
    <section
      data-error={isError}
      data-disabled={isDisabled}
      className={classNames(styles.container, styles[size], containerCn)}
      {...containerProps}
    >
      {labelValue && (
        <label
          className={classNames(styles.label, labelCn)}
          {...labelProps}
        >
          {labelValue}
        </label>
      )}

      {customInputComponent ? (
        customInputComponent
      ) : (
        <div
          className={classNames(styles.inner, wrapperCn)}
          {...wrapperProps}
        >
          {icon}

          {type === "textarea" ? (
            <textarea
              className={classNames(styles.field, textAreaCn)}
              {...textAreaProps}
            />
          ) : (
            <input
              type={showPassword && showPasswordLocal ? "text" : inputType}
              className={classNames(styles.field, inputCn)}
              {...inputProps}
            />
          )}

          {children}

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
