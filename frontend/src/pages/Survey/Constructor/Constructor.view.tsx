/* eslint-disable no-magic-numbers */
// src/pages/Constructor/ConstructorView.tsx
import React, { useRef } from "react";

import type { TCompletionScreen, TPersonalScreen, TQuestion, TWelcomeScreen } from "../Survey.types";

import styles from "./Constructor.module.scss";

import { Binary } from "./Question/Binary";
import { DateQuestion } from "./Question/Date";
import { Dropdown } from "./Question/Dropdown";
import { Multi } from "./Question/Multi";
import { Single } from "./Question/Single";
import { Text } from "./Question/Text";
import { Textarea } from "./Question/Textarea";
import Completion from "./Screen/Completion";
import Personal from "./Screen/Personal";
import Welcome from "./Screen/Welcome";

type QuestionOnly = "single" | "multi" | "binary" | "dropdown" | "text" | "textarea" | "date";

const QUESTION_COMPONENTS: Record<
  QuestionOnly,
  React.FC<{ item: TQuestion; onChange: (upd: Partial<TQuestion>) => void }>
> = {
  single: Single,
  multi: Multi,
  binary: Binary,
  dropdown: Dropdown,
  text: Text,
  textarea: Textarea,
  date: DateQuestion,
};

type Props = {
  welcome: TWelcomeScreen;
  questions: TQuestion[];
  personal: TPersonalScreen;
  completion: TCompletionScreen;
  setQuestions: React.Dispatch<React.SetStateAction<TQuestion[]>>;
  updateWelcome: (upd: Partial<TWelcomeScreen>) => void;
  updatePersonal: (upd: Partial<TPersonalScreen>) => void;
  updateCompletion: (upd: Partial<TCompletionScreen>) => void;
  onSave: () => void;
};

const ConstructorView: React.FC<Props> = ({
  welcome,
  questions,
  personal,
  completion,
  setQuestions,
  updateWelcome,
  updatePersonal,
  updateCompletion,
  onSave,
}) => {
  const sectionRefs = useRef<Array<HTMLDivElement | null>>([]);

  const scrollTo = (idx: number) => {
    sectionRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const addQuestion = (type: QuestionOnly) => {
    setQuestions(prev => [
      ...prev,
      {
        type,
        order: prev.length + 1,
        required: false,
        title: "",
        description: "",
        options: ["single", "multi", "dropdown"].includes(type) ? [""] : undefined,
      } as TQuestion,
    ]);
  };

  const updateQuestion = (idx: number, upd: Partial<TQuestion>) => {
    setQuestions(prev => {
      const next = [...prev];

      next[idx] = { ...next[idx], ...upd };

      return next;
    });
  };

  const removeQuestion = (idx: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== idx));
  };

  return (
    <>
      <nav className={styles.nav}>
        <button onClick={() => scrollTo(0)}>Приветствие</button>
        <button onClick={() => scrollTo(1)}>Вопросы</button>
        <button onClick={() => scrollTo(2)}>Сбор данных</button>
        <button onClick={() => scrollTo(3)}>Завершение</button>
      </nav>

      <div className={styles.root}>
        <div className={styles.toolbar}>
          {(Object.keys(QUESTION_COMPONENTS) as QuestionOnly[]).map(t => (
            <button
              key={t}
              onClick={() => addQuestion(t)}
            >
              + {t}
            </button>
          ))}
          <button
            className={styles.save}
            onClick={onSave}
          >
            Сохранить
          </button>
        </div>

        {/* Welcome */}
        <div
          ref={el => {
            sectionRefs.current[0] = el;
          }}
          className={styles.item}
        >
          <h3 className={styles.sectionTitle}>Экран приветствия</h3>
          <Welcome
            data={welcome}
            onChange={updateWelcome}
          />
        </div>

        {/* Questions */}
        <div
          ref={el => {
            sectionRefs.current[1] = el;
          }}
          className={styles.item}
        >
          <h3 className={styles.sectionTitle}>Вопросы</h3>
          {questions.map((q, i) => {
            const Comp = QUESTION_COMPONENTS[q.type as QuestionOnly];

            return (
              <div
                key={i}
                className={styles.questionBlock}
              >
                <button
                  className={styles.remove}
                  onClick={() => removeQuestion(i)}
                >
                  ×
                </button>
                <Comp
                  item={q}
                  onChange={upd => updateQuestion(i, upd)}
                />
              </div>
            );
          })}
        </div>

        {/* Personal */}
        <div
          ref={el => {
            sectionRefs.current[2] = el;
          }}
          className={styles.item}
        >
          <h3 className={styles.sectionTitle}>Экран сбора данных</h3>
          <Personal
            data={personal}
            onChange={updatePersonal}
          />
        </div>

        {/* Completion */}
        <div
          ref={el => {
            sectionRefs.current[3] = el;
          }}
          className={styles.item}
        >
          <h3 className={styles.sectionTitle}>Экран завершения</h3>
          <Completion
            data={completion}
            onChange={updateCompletion}
          />
        </div>
      </div>
    </>
  );
};

export default ConstructorView;
