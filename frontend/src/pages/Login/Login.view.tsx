import React from "react";

import { TextField } from "@ui/TextField";
import { Link } from "react-router-dom";

import type { TLoginViewProps } from "./Login.types";

/**
 * Компонент страницы входа
 *
 * @prop {string} email - эл. почта, введенная пользователем
 * @prop {string} password - пароль, введенный пользователем
 * @prop {(event: React.FormEvent<HTMLFormElement>) => void} handleSubmit - обработчик отправки формы
 * @prop {(event: React.ChangeEvent<HTMLInputElement>) => void} handleEmailChange - обработчик изменения эл. почты
 * @prop {(event: React.ChangeEvent<HTMLInputElement>) => void} handlePasswordChange - обработчик изменения пароля
 */
const LoginView: React.FC<TLoginViewProps> = ({
  email,
  password,
  handleSubmit,
  handleEmailChange,
  handlePasswordChange,
}) => {
  return (
    <div>
      <h1>Вход</h1>

      <span>
        Нет аккаунта?{" "}
        <Link
          to="/registration"
          replace
        >
          Регистрация
        </Link>
      </span>

      <form onSubmit={handleSubmit}>
        <TextField
          config={{
            inputProps: {
              value: email,
              type: "email",
              autoComplete: "email",
              placeholder: "Эл. почта",
              onChange: handleEmailChange,
            },
          }}
        />
        <TextField
          showPassword
          config={{
            inputProps: {
              type: "text",
              value: password,
              placeholder: "Пароль",
              autoComplete: "current-password",
              onChange: handlePasswordChange,
            },
          }}
        />

        <button type="submit">Войти</button>
      </form>
    </div>
  );
};

export default LoginView;
