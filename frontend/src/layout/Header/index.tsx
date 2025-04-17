import React from "react";

import authAxiosInstance from "@api/authInstance";
import { useError } from "@hooks/useError";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { clearUserState } from "@store/slices/user";
import { useNavigate } from "react-router-dom";

import styles from "./Header.module.scss";

export type TLayoutHeaderProps = {
  ref: React.RefObject<HTMLElement | null>;
};

const LayoutHeader: React.FC<TLayoutHeaderProps> = ({ ref }) => {
  const navigate = useNavigate();
  const proccessError = useError();
  const dispatch = useAppDispatch();

  const user = useAppSelector(state => state.user);

  const handleLogout = React.useCallback(async (event: React.MouseEvent) => {
    event.preventDefault();

    try {
      await authAxiosInstance.post("/logout");

      dispatch(clearUserState());
      navigate("/");
    } catch (error) {
      proccessError(error);
    }
  }, []);

  return (
    <header
      ref={ref}
      className={styles.header}
    >
      <span className={styles.header__logo}>Pollitect</span>

      {user.id !== -1 && (
        <button
          type="button"
          onClick={handleLogout}
          className={styles.header__exit}
        >
          Выйти
          <span className="icon-exit"></span>
        </button>
      )}
    </header>
  );
};

export default LayoutHeader;
