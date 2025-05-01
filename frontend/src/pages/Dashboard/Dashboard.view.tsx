import React from "react";

import { Link } from "react-router-dom";

import type { TDashboardViewProps } from "./Dashboard.types";

import styles from "./Dashboard.module.scss";

import SurveyCard from "./SurveyCard";

const DashboardView: React.FC<TDashboardViewProps> = ({ surveyCards }) => (
  <section className={styles.dashboard}>
    <div className={styles.headerRow}>
      <h1 className={styles.title}>Мои опросы</h1>

      <Link to="/survey/edit/new">
        <button
          className={styles.createBtn}
          type="button"
        >
          + Создать опрос
        </button>
      </Link>
    </div>

    <div className={styles.cardsGrid}>
      {surveyCards?.length
        ? surveyCards.map(surveyCard => (
            <SurveyCard
              key={surveyCard.id}
              surveyCard={surveyCard}
            />
          ))
        : "Нет опросов"}
    </div>
  </section>
);

export default DashboardView;
