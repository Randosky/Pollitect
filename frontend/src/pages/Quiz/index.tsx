import React, { ReactElement } from "react";

import { NavLink, Outlet, useParams } from "react-router-dom";

import styles from "./Quiz.module.scss";

const Quiz: React.FC = (): ReactElement => {
  const { quizId } = useParams<{ quizId: string }>();

  return (
    <div className={styles.quiz}>
      <nav className={styles.tabs}>
        {["edit", "design", "settings"].map(tab => (
          <NavLink
            key={tab}
            to={`${tab}/${quizId}`}
            className={({ isActive }) => (isActive ? `${styles.tab} ${styles.active}` : styles.tab)}
          >
            {
              {
                edit: "Конструктор",
                design: "Дизайн",
                settings: "Настройки",
              }[tab]
            }
          </NavLink>
        ))}
      </nav>
      <div className={styles.content}>
        <Outlet />
      </div>
    </div>
  );
};

export default Quiz;
