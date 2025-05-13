/* eslint-disable sonarjs/no-nested-functions */
/* eslint-disable max-nested-callbacks */
import React, { useMemo, useState } from "react";

import Button from "@ui/Button";
import classNames from "classnames";

import { useAppSelector } from "@/store/hooks";

import styles from "./Statistic.module.scss";

type ViewMode = "byUser" | "byQuestion";

const SEC_IN_MIN = 60;
const SEC_IN_HOUR = 3600;
const MAX_TEXT_LENGTH = 500;

const formatTime = (sec: number) => {
  const h = Math.floor(sec / SEC_IN_HOUR);
  const m = Math.floor((sec % SEC_IN_HOUR) / SEC_IN_MIN);
  const s = sec % SEC_IN_MIN;

  return (
    <span>
      {h > 0 && (
        <span>
          <strong>{h}</strong>&nbsp;час
        </span>
      )}

      {m > 0 && (
        <span>
          <strong>{m}</strong>&nbsp;мин
        </span>
      )}

      <span>
        <strong>{s || 0}</strong>&nbsp;сек
      </span>
    </span>
  );
};

/** Ограниченный текст с кнопкой "Ещё" */
const TruncatedText: React.FC<{ text: string }> = ({ text }) => {
  const [limit, setLimit] = useState(MAX_TEXT_LENGTH);
  const hasMore = text.length > limit;

  return (
    <div className={styles.truncatedText}>
      {text.slice(0, limit)}
      {hasMore && (
        <Button
          variant="ghost"
          className={styles.moreButton}
          onClick={() => setLimit(limit + MAX_TEXT_LENGTH)}
        >
          ещё
        </Button>
      )}
    </div>
  );
};

/** Преобразует value в React-вывод */
const AnswerDisplay: React.FC<{ value: string | string[] | boolean }> = ({ value }) => {
  if (Array.isArray(value)) return <span>{value.join(", ")}</span>;

  if (typeof value === "boolean") return <span>{value ? "Да" : "Нет"}</span>;

  return <TruncatedText text={value} />;
};

const Summary: React.FC = () => {
  const { statistics } = useAppSelector(state => state.survey.surveyForm);

  const total = statistics.completedCount + statistics.incompleteCount;
  const percent = total > 0 ? Math.round((statistics.completedCount / total) * 100) : 0;

  return (
    <section className={styles.summary}>
      <div className={styles.stat}>
        <h2>Всего прохождений</h2>
        <strong>{total || 0}</strong>
      </div>
      <div className={styles.stat}>
        <h2>Завершено</h2>
        <strong>{percent || 0}%</strong>
      </div>
      <div className={styles.stat}>
        <h2>Среднее время</h2>
        <p>{statistics.averageTimeSec !== null ? formatTime(statistics.averageTimeSec || 0) : "—"}</p>
      </div>
    </section>
  );
};

const Tabs: React.FC<{ view: ViewMode; setView: (v: ViewMode) => void }> = ({ view, setView }) => (
  <div className={styles.tabs}>
    <Button
      variant="outline"
      onClick={() => setView("byUser")}
      className={classNames(styles.tab, { [styles.active]: view === "byUser" })}
    >
      По пользователям
    </Button>

    <Button
      variant="outline"
      onClick={() => setView("byQuestion")}
      className={classNames(styles.tab, {
        [styles.active]: view === "byQuestion",
      })}
    >
      По вопросам
    </Button>
  </div>
);

const ByUser: React.FC = () => {
  const { responses, questions } = useAppSelector(state => state.survey.surveyForm);

  if (responses.length === 0) {
    return <p className={styles.empty}>Нет данных по сессиям</p>;
  }

  return (
    <div className={styles.sessions}>
      {responses.map(session => (
        <div
          key={session.sessionId}
          className={styles.sessionCard}
        >
          <div className={styles.sessionHeader}>
            <span className={styles.sessionLabel}>Сессия №{session.sessionId}</span>

            {session.isCompleted ? (
              <span className={styles.badgeDone}>✔ Завершена</span>
            ) : (
              <span className={styles.badgePending}>● В процессе</span>
            )}
          </div>

          {session.name && session.email && session.phone && session.address && (
            <div className={styles.sessionPersonal}>
              {session.name && <div>👤&nbsp;{session.name}</div>}
              {session.email && <div>✉&nbsp;{session.email}</div>}
              {session.phone && <div>📞&nbsp;{session.phone}</div>}
              {session.address && <div>🏠&nbsp;{session.address}</div>}
            </div>
          )}

          <div className={styles.sessionAnswers}>
            {session.answers.map((ans, idx) => {
              const q = questions.find(x => x.id === ans.question_id);
              const title = q ? q.title : "(вопрос удалён)";

              return (
                <div
                  key={idx}
                  className={styles.answerRow}
                >
                  <strong>{String(title)}</strong>
                  <AnswerDisplay value={ans.value} />
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
};

const ByQuestion: React.FC = () => {
  const { responses, questions } = useAppSelector(state => state.survey.surveyForm);

  const stats = useMemo(() => {
    return questions.map(q => {
      const collected: unknown[] = [];

      responses.forEach(sess =>
        sess.answers.forEach(ans => {
          if (ans.question_id === q.id) collected.push(ans.value);
        })
      );

      const isChoice = q.type === "single" || q.type === "dropdown" || q.type === "binary" || q.type === "multi";

      if (isChoice) {
        const freq: Record<string, number> = {};

        collected.forEach(v => {
          if (Array.isArray(v)) {
            v.forEach(x => (freq[x] = (freq[x] || 0) + 1));
          } else {
            let key = String(v);

            if (typeof v === "boolean") {
              key = v ? "Да" : "Нет";
            }

            freq[key] = (freq[key] || 0) + 1;
          }
        });

        return { question: q, type: "choice" as const, data: freq };
      }

      return { question: q, type: "text" as const, data: collected as string[] };
    });
  }, [questions, responses]);

  return (
    <div className={styles.questions}>
      {stats.map(({ question, type, data }, idx) => (
        <div
          key={idx}
          className={styles.questionBlock}
        >
          <h3 className={styles.qTitle}>{question.title}</h3>

          {type === "choice" ? (
            <ul className={styles.choiceList}>
              {Object.entries(data).map(([opt, cnt]) => (
                <li key={opt}>
                  <span className={styles.choiceOption}>
                    <AnswerDisplay value={opt} />
                  </span>
                  <span className={styles.choiceCount}>{cnt}</span>
                </li>
              ))}
            </ul>
          ) : (
            <ul className={styles.textList}>
              {data.map((txt, i) => (
                <li
                  key={i}
                  className={styles.textItem}
                >
                  <AnswerDisplay value={txt} />
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
};

const Statistic: React.FC = () => {
  const [view, setView] = useState<ViewMode>("byUser");

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>Статистика опроса</h1>
      <Summary />

      <Tabs
        view={view}
        setView={setView}
      />

      <div className={styles.content}>{view === "byUser" ? <ByUser /> : <ByQuestion />}</div>
    </div>
  );
};

export default React.memo(Statistic);
