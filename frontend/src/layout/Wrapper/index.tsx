import React, { PropsWithChildren } from "react";

import userAxiosInstance from "@api/userInstance";
import { useError } from "@hooks/useError";
import { useAppDispatch } from "@store/hooks";
import { TUserWithAccessToken, updateUserState } from "@store/slices/user";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import styles from "../Layout.module.scss";

const LayoutWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const processError = useError();

  /** Получаем данные о пользователе */
  useQuery({
    queryKey: ["getUserSettings"],
    queryFn: async () => {
      if (!sessionStorage.getItem("accessToken")) return {};

      try {
        const { data } = await userAxiosInstance.get<TUserWithAccessToken>("/");

        dispatch(updateUserState(data.user));

        navigate(`/dashboard/${data.user.id}`);

        return data;
      } catch (error) {
        processError(error);

        return {};
      }
    },
    refetchOnMount: true,
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });

  return <div className={styles.wrapper}>{children}</div>;
};

export default LayoutWrapper;
