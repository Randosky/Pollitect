import React, { ReactElement } from "react";

import authAxiosInstance from "@api/authInstance";
import { useError } from "@hooks/useError";
import { useAppDispatch } from "@store/hooks";
import { openToaster, setLoaderData } from "@store/slices/layout";
import { type TUserWithAccessToken, updateUserState } from "@store/slices/user";
import { validateEmptyFields } from "@utils/validateEmptyFields";
import { useNavigate } from "react-router-dom";

import LoginView from "./Login.view";

/**
 * Компонент-контейнер для страницы входа.
 * Управляет состоянием полей электронной почты и пароля, а также
 * обрабатывает события изменения и отправки формы.
 *
 * @returns {ReactElement} Компонент LoginView с переданными
 * данными и обработчиками.
 */
const LoginContainer: React.FC = (): ReactElement => {
  const navigate = useNavigate();
  const proccessError = useError();
  const dispatch = useAppDispatch();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!validateEmptyFields({ email, password })) {
        dispatch(openToaster({ content: "Заполните поля" }));

        return;
      }

      dispatch(setLoaderData(true));

      try {
        const { data } = await authAxiosInstance.post<TUserWithAccessToken>("/login", {
          email,
          password,
        });

        dispatch(updateUserState(data.user));
        navigate(`/dashboard/${data.user.id}`);
      } catch (error) {
        proccessError(error);
      } finally {
        dispatch(setLoaderData(false));
      }
    },
    [email, password]
  );

  const handleEmailChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.currentTarget.value);
  }, []);

  const handlePasswordChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value);
  }, []);

  return (
    <LoginView
      email={email}
      password={password}
      handleSubmit={handleSubmit}
      handleEmailChange={handleEmailChange}
      handlePasswordChange={handlePasswordChange}
    />
  );
};

export { LoginContainer };
