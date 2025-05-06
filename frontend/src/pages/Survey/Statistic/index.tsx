import React from "react";

import Button from "@ui/Button";

import { useAppSelector } from "@/store/hooks";

import styles from "./Statistic.module.scss";

export const Statistic = () => {
  const { statistics, responses, questions } = useAppSelector(state => state.survey.surveyForm);

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Статистика опроса</h1>

      <section className={styles.summary}>
        <div className={styles.stat}>
          <h2>Ответов</h2>
          <p>{statistics.responsesCount}</p>
        </div>
        <div className={styles.stat}>
          <h2>Завершено</h2>
          <p>{statistics.completionRate}%</p>
        </div>
        <div className={styles.stat}>
          <h2>Среднее время</h2>
          <p>{statistics.averageTimeSec ?? "—"} сек.</p>
        </div>
      </section>

      <section className={styles.responsesBlock}>
        <h2 className={styles.sectionTitle}>Ответы</h2>
        {responses.length === 0 ? (
          <p className={styles.empty}>Ответов пока нет.</p>
        ) : (
          <div className={styles.responses}>
            {responses.map((response, index) => {
              const question = questions.find(q => q.id === response.question_id);

              return (
                <div
                  key={index}
                  className={styles.responseCard}
                >
                  <div className={styles.question}>
                    <strong>{question?.title || "Неизвестный вопрос"}</strong>
                  </div>
                  <div className={styles.answer}>
                    {Array.isArray(response.value)
                      ? response.value.join(", ")
                      : typeof response.value === "boolean"
                        ? response.value
                          ? "Да"
                          : "Нет"
                        : response.value}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <div className={styles.buttonWrapper}>
        <Button onClick={() => window.history.back()}>Назад</Button>
      </div>
    </div>
  );
};

export default Statistic;
