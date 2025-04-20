import React from "react";

import authAxiosInstance from "@api/authInstance";
import { useError } from "@hooks/useError";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { clearUserState } from "@store/slices/user";
import { useNavigate } from "react-router-dom";

import styles from "../Header.module.scss";

const Logout = () => {
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

  if (user.id !== -1)
    return (
      <button
        type="button"
        onClick={handleLogout}
        className={styles.header__exit}
      >
        Выйти
        <span className="icon-exit"></span>
      </button>
    );
};

export default Logout;
