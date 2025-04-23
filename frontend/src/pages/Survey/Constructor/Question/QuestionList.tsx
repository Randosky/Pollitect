import React, { useCallback, useEffect, useState } from "react";

import Question from ".";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { updateSurveyForm } from "@store/slices/survey";

import { QUESTION_COMPONENTS } from "../Constuctor.config";

import type { TQuestion, TQuestionType } from "@pages/Survey/Survey.types";

import styles from "../Constructor.module.scss";

const QuestionList = () => {
  const dispatch = useAppDispatch();

  const questions = useAppSelector(state => state.survey.surveyForm.questions);

  const [questionsLocal, setQuestionsLocal] = useState(questions);

  /** Обновляем локальное состояние */
  useEffect(() => setQuestionsLocal(questions), [questions]);

  /**
   * Обновляет вопрос в списке
   * @param {number} index - индекс вопроса
   * @param {Partial<TQuestion>} upd - обновления вопроса
   * @returns {void}
   */
  const updateQuestion = useCallback(
    (index: number, upd: Partial<TQuestion>): void => {
      setQuestionsLocal(prev =>
        prev.map((question, i) => {
          if (i !== index) return question;

          return { ...question, ...upd };
        })
      );
    },
    [questionsLocal]
  );

  /**
   * Удаляет вопрос из списка
   * @param {number} index - индекс вопроса
   * @returns {void}
   */
  const removeQuestion = useCallback(
    (index: number): void => {
      setQuestionsLocal(prev => prev.filter((_, i) => i !== index));
    },
    [questionsLocal]
  );

  /**
   * Функция для добавления нового вопроса
   * @param {TQuestionType} type - тип вопроса
   * @returns {void}
   */
  const addQuestion = useCallback(
    (type: TQuestionType): void => {
      const initialQuestion: TQuestion = {
        type,
        order: questions.length + 1,
        required: false,
        title: "",
      };

      setQuestionsLocal(prev => [...prev, initialQuestion]);
    },
    [questionsLocal]
  );

  /**
   * Сохраняет измененное состояние в редакс
   * @returns {void}
   */
  const saveQuestion = useCallback((): void => {
    dispatch(updateSurveyForm({ questions: questionsLocal }));
  }, [dispatch, questionsLocal]);

  return (
    <div className={styles.item}>
      <h3 className={styles.sectionTitle}>Вопросы</h3>

      <div className={styles.toolbar}>
        {(Object.keys(QUESTION_COMPONENTS) as TQuestionType[]).map(type => (
          <button
            key={type}
            onClick={() => addQuestion(type)}
          >
            + {type}
          </button>
        ))}
      </div>

      {questionsLocal.map((question, questionIndex) => {
        const QuestionComponent = QUESTION_COMPONENTS[question.type];

        return (
          <div
            key={questionIndex}
            className={styles.questionBlock}
          >
            <button
              className={styles.remove}
              onClick={() => removeQuestion(questionIndex)}
            >
              ×
            </button>

            <Question
              item={question}
              onChange={upd => updateQuestion(questionIndex, upd)}
            >
              <QuestionComponent
                item={question}
                onChange={upd => updateQuestion(questionIndex, upd)}
              />
            </Question>
          </div>
        );
      })}

      <button onClick={saveQuestion}>Сохранить</button>
    </div>
  );
};

export default QuestionList;
