/* eslint-disable jsx-a11y/label-has-associated-control */
import React from "react";

import { useError } from "@hooks/useError";
import { useSurveyController } from "@hooks/useSurveyController";
import { useQueryClient } from "@tanstack/react-query";
import classNames from "classnames";
import { Link } from "react-router-dom";

import type { TSurveyCardProps } from "../Dashboard.types";

import styles from "./SurveyCard.module.scss";

const SEC_IN_MIN = 60;

const SurveyCard: React.FC<TSurveyCardProps> = ({ surveyCard }) => {
  const {
    id,
    title,
    active,
    display_settings: displaySettings,
    statistics: { responsesCount, completionRate, averageTimeSec } = {},
  } = surveyCard;

  const processError = useError();
  const queryClient = useQueryClient();

  const { updateSurvey, deleteSurvey } = useSurveyController();

  /**
   * Функция для удаления опроса
   * @returns {void}
   */
  const handleDelete = async (): Promise<void> => {
    if (!id) return;

    try {
      await deleteSurvey(id);

      queryClient.invalidateQueries({ queryKey: ["getSurveys"] });
    } catch (error) {
      processError(error);
    }
  };

  /**
   * Функция изменения активности опроса
   * @param {React.ChangeEvent<HTMLInputElement>} event - событие изменения активности
   * @returns {void}
   */
  const handleToggleActive = async (event: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    if (!id) return;

    try {
      await updateSurvey(id, { active: event.target.checked });

      queryClient.invalidateQueries({ queryKey: ["getSurveys"] });
    } catch (error) {
      processError(error);
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / SEC_IN_MIN);
    const s = sec % SEC_IN_MIN;

    return `${m} мин ${s} сек`;
  };

  return (
    <article className={styles.card}>
      <header className={styles.header}>
        <h2 className={styles.title}>
          <span>ID: {id}</span>
          <Link to={`/survey/${id}/edit`}>{title}</Link>
        </h2>

        <label
          className={styles.switch}
          htmlFor={`survey-card-checkbox-${id}`}
        >
          <input
            id={`survey-card-checkbox-${id}`}
            type="checkbox"
            checked={active}
            onChange={handleToggleActive}
          />

          <span className={styles.slider} />
        </label>
      </header>

      {displaySettings.url_pattern[0] && (
        <Link
          target="_blank"
          rel="noopener noreferrer"
          to={displaySettings.url_pattern[0]}
        >
          {displaySettings.url_pattern[0]}
        </Link>
      )}

      <div className={styles.stats}>
        <div className={styles.statItem}>
          <strong>{responsesCount}</strong> ответов
        </div>
        <div className={styles.statItem}>
          <strong>{completionRate}%</strong> завершено
        </div>
        {averageTimeSec !== undefined && (
          <div className={styles.statItem}>
            <strong>{formatTime(averageTimeSec)}</strong> в среднем
          </div>
        )}
      </div>

      <footer className={styles.actions}>
        <Link
          to={`/survey/${id}/edit`}
          title="Редактировать"
        >
          <span className={classNames("icon-edit", styles.actionBtn)} />
        </Link>

        <Link
          to={`/survey/${id}/statistic`}
          title="Результаты"
        >
          <span className={classNames("icon-chart", styles.actionBtn)} />
        </Link>

        <button
          type="button"
          onClick={handleDelete}
          title="Удалить"
          className={styles.deleteBtn}
        >
          <span className="icon-trash" />
        </button>
      </footer>
    </article>
  );
};

export default SurveyCard;
