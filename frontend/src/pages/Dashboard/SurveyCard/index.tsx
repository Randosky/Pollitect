import React from "react";

import classNames from "classnames";
import { Link } from "react-router-dom";

import type { TSurveyCardProps } from "../Dashboard.types";

import styles from "./SurveyCard.module.scss";

const SurveyCard: React.FC<TSurveyCardProps> = ({ surveyCard }) => {
  const { id } = surveyCard;

  return (
    <div className={styles.card}>
      daawd
      {/* <Link
        to={`/survey/edit/${id}`}
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
        <Link to={`/survey/edit/${id}`}>
          <span className={classNames("icon-edit", styles.actionBtn)} />
        </Link>

        <Link to={`/survey/results/${id}`}>
          <span className={classNames("icon-chart", styles.actionBtn)} />
        </Link>

        <button type="button">
          <span className={classNames("icon-trash", styles.deleteBtn)} />
        </button>
      </div> */}
    </div>
  );
};

export default SurveyCard;
