import React from "react";

import authAxiosInstance from "@api/authInstace";
import { useNavigate } from "react-router-dom";

import RegistrationView from "./Registration.view";

import { SUCCESS_CODE } from "@/config";

const RegistrationContainer: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const handleSubmit = React.useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();

      try {
        const response = await authAxiosInstance.post("api/", {
          title: email,
          description: password,
        });

        if (response.status === SUCCESS_CODE) {
          navigate("/dashboard");
        }
      } catch (error) {
        console.error(error);
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
    <RegistrationView
      email={email}
      password={password}
      handleSubmit={handleSubmit}
      handleEmailChange={handleEmailChange}
      handlePasswordChange={handlePasswordChange}
    />
  );
};

export { RegistrationContainer };
