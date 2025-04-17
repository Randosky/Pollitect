import React from "react";

import { TextField } from "@ui/TextField";
import { Link } from "react-router-dom";

import type { TLoginViewProps } from "./Login.types";

import styles from "./Login.module.scss";

const LoginView: React.FC<TLoginViewProps> = ({
  email,
  password,
  handleSubmit,
  handleEmailChange,
  handlePasswordChange,
}) => (
  <div className={styles.authContainer}>
    <div className={styles.card}>
      <h1 className={styles.title}>Вход</h1>

      <span className={styles.switch}>
        Нет аккаунта?{" "}
        <Link
          to="/registration"
          replace
          className={styles.link}
        >
          Регистрация
        </Link>
      </span>

      <form
        onSubmit={handleSubmit}
        className={styles.form}
      >
        <div className={styles.inputWrapper}>
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
        </div>

        <div className={styles.inputWrapper}>
          <TextField
            config={{
              inputProps: {
                value: password,
                type: "password",
                autoComplete: "current-password",
                placeholder: "Пароль",
                onChange: handlePasswordChange,
              },
            }}
          />
        </div>

        <button
          type="submit"
          className={styles.submitBtn}
        >
          Войти
        </button>
      </form>
    </div>
  </div>
);

export default LoginView;
