import React from "react";

import { Link } from "react-router-dom";

import type { TSurveyCardProps } from "./SurveyCard.types";

import styles from "./SurveyCard.module.scss";

const SurveyCard: React.FC<TSurveyCardProps> = ({ surveyCard }) => {
  const { id, title, description } = surveyCard;

  return (
    <Link
      to={`/quiz/edit/${id}`}
      className={styles.card}
    >
      <div className={styles.cardHeader}>{title}</div>

      <div className={styles.cardBody}>{description}</div>

      <div className={styles.cardFooter}>Перейти к опросу →</div>
    </Link>
  );
};

export default SurveyCard;
