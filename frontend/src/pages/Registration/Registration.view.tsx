import React from "react";

import { TextField } from "@ui/TextField";
import { Link } from "react-router-dom";

import type { TRegistrationViewProps } from "./Registration.types";

const RegistrationView: React.FC<TRegistrationViewProps> = ({
  name,
  email,
  password,
  handleSubmit,
  handleNameChange,
  handleEmailChange,
  handlePasswordChange,
}) => {
  return (
    <div>
      <h1>Регистрация</h1>

      <span>
        Уже есть аккаунт?{" "}
        <Link
          to="/login"
          replace
        >
          Войти
        </Link>
      </span>

      <form onSubmit={handleSubmit}>
        <TextField
          config={{
            inputProps: {
              value: name,
              type: "text",
              autoComplete: "name",
              placeholder: "Имя",
              onChange: handleNameChange,
            },
          }}
        />
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

export default RegistrationView;
