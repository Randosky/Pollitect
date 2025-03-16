import React, { ReactElement } from "react";

import { NavLink, Outlet, useParams } from "react-router-dom";

import styles from "./Quiz.module.scss";

/**
 * Компонент Quiz, который отображает навигацию
 * между страницами опроса.
 *
 * @returns {ReactElement} - компонент Quiz
 */
const Quiz: React.FC = (): ReactElement => {
  const { quizId } = useParams();

  return (
    <div>
      <nav>
        <NavLink
          to={`edit/${quizId}`}
          className={({ isActive }) => (isActive ? `${styles.tab} ${styles.active}` : styles.tab)}
        >
          Конструктор
        </NavLink>

        <NavLink
          to={`design/${quizId}`}
          className={({ isActive }) => (isActive ? `${styles.tab} ${styles.active}` : styles.tab)}
        >
          Дизайн
        </NavLink>

        <NavLink
          to={`settings/${quizId}`}
          className={({ isActive }) => (isActive ? `${styles.tab} ${styles.active}` : styles.tab)}
        >
          Настройки
        </NavLink>
      </nav>

      <Outlet />
    </div>
  );
};

export default Quiz;
