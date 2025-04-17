import React from "react";

import { TextField } from "@ui/TextField";
import { Link } from "react-router-dom";

import type { TRegistrationViewProps } from "./Registration.types";

import styles from "./Registration.module.scss";

const RegistrationView: React.FC<TRegistrationViewProps> = ({
  name,
  email,
  password,
  handleSubmit,
  handleNameChange,
  handleEmailChange,
  handlePasswordChange,
}) => (
  <div className={styles.authContainer}>
    <div className={styles.card}>
      <h1 className={styles.title}>Регистрация</h1>

      <span className={styles.switch}>
        Уже есть аккаунт?{" "}
        <Link
          to="/login"
          replace
          className={styles.link}
        >
          Войти
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
                value: name,
                type: "text",
                autoComplete: "name",
                placeholder: "Имя",
                onChange: handleNameChange,
              },
            }}
          />
        </div>

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
          Зарегистрироваться
        </button>
      </form>
    </div>
  </div>
);

export default RegistrationView;
