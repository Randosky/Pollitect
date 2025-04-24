import { useCallback, useEffect, useMemo, useState } from "react";

import Question from ".";
import ActionButtons from "@layout/Footer/ActionButtons";
import { useLayoutFooter } from "@layout/Provider/LayoutFooter";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { updateSurveyForm } from "@store/slices/survey";
import checkDeepEquals from "@utils/checkDeepEquals";

import { QUESTION_TYPES } from "../Constuctor.config";

import type { TQuestion, TQuestionType } from "@pages/Survey/Survey.types";

import styles from "./Question.module.scss";

const QuestionList = () => {
  const dispatch = useAppDispatch();

  const questions = useAppSelector(state => state.survey.surveyForm.questions);

  const [questionsLocal, setQuestionsLocal] = useState(questions);
  const [initialQuestionsLocal, setInitialQuestionsLocal] = useState(questions);

  const { handleShowFooter, handleCloseFooter } = useLayoutFooter();

  const canSave = useMemo(
    () => !checkDeepEquals(questionsLocal, initialQuestionsLocal),
    [questionsLocal, initialQuestionsLocal]
  );

  /**
   * Сохраняет измененное состояние в редакс
   * @returns {void}
   */
  const saveQuestion = useCallback((): void => {
    dispatch(updateSurveyForm({ questions: questionsLocal }));
  }, [dispatch, questionsLocal]);

  /**
   * Очищает состояние
   * @returns {void}
   */
  const cancelQuestion = useCallback((): void => {
    setQuestionsLocal(initialQuestionsLocal);
  }, [initialQuestionsLocal]);

  /** Задаем функции обновления формы */
  useEffect(() => {
    if (canSave) {
      handleShowFooter(
        <ActionButtons
          handleSave={saveQuestion}
          handleCancel={cancelQuestion}
        />
      );
    }

    return handleCloseFooter;
  }, [canSave, saveQuestion, cancelQuestion]);

  /** Обновляем локальное состояние */
  useEffect(() => {
    setQuestionsLocal(questions);
    setInitialQuestionsLocal(questions);
  }, [questions]);

  /**
   * Обновляет вопрос в списке
   * @param {number} index - индекс вопроса
   * @param {Partial<TQuestion>} upd - обновления вопроса
   * @returns {void}
   */
  const updateQuestion = useCallback((index: number, upd: Partial<TQuestion>): void => {
    setQuestionsLocal(prev =>
      prev.map((question, i) => {
        if (i !== index) return question;

        return { ...question, ...upd };
      })
    );
  }, []);

  /**
   * Удаляет вопрос из списка
   * @param {number} index - индекс вопроса
   * @returns {void}
   */
  const removeQuestion = useCallback((index: number): void => {
    setQuestionsLocal(prev => prev.filter((_, i) => i !== index));
  }, []);

  /**
   * Функция для добавления нового вопроса
   * @param {TQuestionType} type - тип вопроса
   * @returns {void}
   */
  const addQuestion = useCallback((type: TQuestionType): void => {
    setQuestionsLocal(prev => {
      const initialQuestion: TQuestion = {
        type,
        order: prev.length + 1,
        required: false,
        title: "",
      };

      return [...prev, initialQuestion];
    });
  }, []);

  const handlers = useMemo(() => {
    return questionsLocal.map((_, i) => ({
      onChange: (upd: Partial<TQuestion>) => updateQuestion(i, upd),
      onRemove: () => removeQuestion(i),
    }));
  }, [questionsLocal.length, updateQuestion, removeQuestion]);

  return (
    <div className={styles.questionList}>
      <div className={styles.toolbar}>
        {QUESTION_TYPES.map(type => (
          <button
            key={type}
            onClick={() => addQuestion(type)}
          >
            + {type}
          </button>
        ))}
      </div>

      {questionsLocal.map((question, questionIndex) => {
        return (
          <div
            key={`${questionIndex}-${question.order}`}
            className={styles.questionBlock}
          >
            <button
              className={styles.remove}
              onClick={handlers[questionIndex].onRemove}
            >
              ×
            </button>

            <Question
              item={question}
              onChange={handlers[questionIndex].onChange}
            />
          </div>
        );
      })}
    </div>
  );
};

export default QuestionList;
