import React, { PropsWithChildren } from "react";

import userAxiosInstance from "@api/userInstance";
import { useError } from "@hooks/useError";
import { useAppDispatch } from "@store/hooks";
import { TUserWithAccessToken, updateUserState } from "@store/slices/user";
import { useQuery } from "@tanstack/react-query";

import styles from "../Layout.module.scss";

const LayoutWrapper: React.FC<PropsWithChildren<{ ref: React.RefObject<HTMLDivElement | null> }>> = ({
  ref,
  children,
}) => {
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

  return (
    <div
      id="layout-wrapper"
      ref={ref}
      className={styles.wrapper}
    >
      {children}
    </div>
  );
};

export default LayoutWrapper;
