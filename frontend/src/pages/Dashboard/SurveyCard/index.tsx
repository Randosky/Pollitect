import React from "react";

import classNames from "classnames";
import { Link } from "react-router-dom";

import type { TSurveyCardProps } from "./SurveyCard.types";

import styles from "./SurveyCard.module.scss";

const SurveyCard: React.FC<TSurveyCardProps> = ({ surveyCard }) => {
  const { id, title, description, responsesCount, completionRate, updatedAt } = surveyCard;

  return (
    <div className={styles.card}>
      <Link
        to={`/quiz/edit/${id}`}
        className={styles.cardHeader}
      >
        {title}
      </Link>

      <div className={styles.cardBody}>{description}</div>

      <div className={styles.stats}>
        <span className={styles.badge}>{responsesCount} ответов</span>
        <span className={styles.badge}>{completionRate}% завершено</span>
        <span className={styles.badge}>Обновлено {updatedAt}</span>
      </div>

      <div className={styles.actions}>
        <Link to={`/quiz/edit/${id}`}>
          <span className={classNames("icon-edit", styles.actionBtn)} />
        </Link>

        <Link to={`/quiz/results/${id}`}>
          <span className={classNames("icon-chart", styles.actionBtn)} />
        </Link>

        <button type="button">
          <span className={classNames("icon-trash", styles.deleteBtn)} />
        </button>
      </div>
    </div>
  );
};

export default SurveyCard;
