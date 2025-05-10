import React from "react";

import { useAppSelector } from "@/store/hooks";

import styles from "./Statistic.module.scss";

export const Statistic: React.FC = () => {
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

      <section className={styles.sessionsBlock}>
        <h2 className={styles.sectionTitle}>По сессиям</h2>
        {responses.length === 0 ? (
          <p className={styles.empty}>Нет данных по сессиям.</p>
        ) : (
          <div className={styles.sessions}>
            {responses.map(session => (
              <div
                key={session.sessionId}
                className={styles.sessionCard}
              >
                <div className={styles.sessionHeader}>
                  <span className={styles.sessionLabel}>Сессия {session.sessionId}</span>
                  {session.isCompleted ? (
                    <span className={styles.completedBadge}>Завершена</span>
                  ) : (
                    <span className={styles.incompleteBadge}>Не завершена</span>
                  )}
                </div>

                <div className={styles.sessionAnswers}>
                  {session.answers.map((ans, idx) => {
                    const question = questions.find(q => q.id === ans.question_id);

                    let display: string;

                    if (Array.isArray(ans.value)) {
                      display = ans.value.join(", ");
                    } else if (typeof ans.value === "boolean") {
                      display = ans.value ? "Да" : "Нет";
                    } else {
                      display = ans.value as string;
                    }

                    return (
                      <div
                        key={idx}
                        className={styles.responseCard}
                      >
                        <div className={styles.question}>
                          <strong>{question?.title ?? "Неизвестный вопрос"}</strong>
                        </div>
                        <div className={styles.answer}>{display}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Statistic;
