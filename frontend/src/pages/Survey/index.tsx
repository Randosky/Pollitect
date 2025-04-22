import React, { ReactElement } from "react";

import { NavLink, Outlet, useParams } from "react-router-dom";

import styles from "./Survey.module.scss";

const Survey: React.FC = (): ReactElement => {
  const { surveyId } = useParams<{ surveyId: string }>();

  return (
    <div className={styles.survey}>
      <nav className={styles.tabs}>
        {["edit", "design", "settings"].map(tab => (
          <NavLink
            key={tab}
            to={`${tab}/${surveyId}`}
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

export default Survey;
