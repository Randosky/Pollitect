import React from "react";

import { TextField } from "@ui/TextField";
import { Link } from "react-router-dom";

const RegistrationView: React.FC = () => {
  return (
    <div>
      <h1>Регистрация</h1>

      <span>
        Уже есть аккаунт?{" "}
        <Link
          to="../login"
          replace
        >
          Войти
        </Link>
      </span>

      <form>
        <TextField
          config={{
            inputProps: {
              placeholder: "Эл. почта",
              autoComplete: "email",
              type: "email",
            },
          }}
        />
        <TextField
          config={{
            inputProps: {
              placeholder: "Пароль",
              autoComplete: "current-password",
              type: "password",
            },
          }}
        />

        <button type="submit">Войти</button>
      </form>
    </div>
  );
};

export default RegistrationView;
