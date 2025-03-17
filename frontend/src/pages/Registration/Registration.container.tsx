import React from "react";

import authAxiosInstance from "@api/authInstance";
import { useError } from "@hooks/useError";
import { useAppDispatch } from "@store/hooks";
import { openToaster } from "@store/slices/layout";
import { type TUserWithAccessToken, updateUserState } from "@store/slices/user";
import { validateEmptyFields } from "@utils/validateEmptyFields";
import { useNavigate } from "react-router-dom";

import RegistrationView from "./Registration.view";

const RegistrationContainer: React.FC = () => {
  const navigate = useNavigate();
  const proccessError = useError();

  const dispatch = useAppDispatch();

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      if (!validateEmptyFields({ email, password })) {
        dispatch(openToaster({ content: "Заполните поля" }));

        return;
      }

      try {
        const { data } = await authAxiosInstance.post<TUserWithAccessToken>("/register", {
          name,
          email,
          password,
        });

        dispatch(updateUserState(data.user));
        navigate(`/dashboard/${data.user.id}`);
      } catch (error) {
        proccessError(error);
      }
    },
    [email, password]
  );

  const handleNameChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.currentTarget.value);
  }, []);

  const handleEmailChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(event.currentTarget.value);
  }, []);

  const handlePasswordChange = React.useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(event.currentTarget.value);
  }, []);

  return (
    <RegistrationView
      name={name}
      email={email}
      password={password}
      handleSubmit={handleSubmit}
      handleNameChange={handleNameChange}
      handleEmailChange={handleEmailChange}
      handlePasswordChange={handlePasswordChange}
    />
  );
};

export { RegistrationContainer };
