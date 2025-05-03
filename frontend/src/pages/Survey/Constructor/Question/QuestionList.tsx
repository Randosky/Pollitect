import { useCallback, useEffect, useMemo, useState } from "react";

import Question from ".";
import { useError } from "@hooks/useError";
import { useSurveyController } from "@hooks/useSurveyController";
import ActionButtons from "@layout/Footer/ActionButtons";
import { useLayoutFooter } from "@layout/Provider/LayoutFooter";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { setLoaderData } from "@store/slices/layout";
import { updateSurveyForm } from "@store/slices/survey";
import checkDeepEquals from "@utils/checkDeepEquals";

import { QUESTION_TYPES } from "../Constuctor.config";

import type { TQuestion, TQuestionType } from "@pages/Survey/Survey.types";

import styles from "./Question.module.scss";

const QuestionList = () => {
  const dispatch = useAppDispatch();
  const processError = useError();

  const { id, questions } = useAppSelector(state => state.survey.surveyForm);

  const [form, setForm] = useState(questions);
  const [initialForm, setInitialForm] = useState(questions);

  const { saveSurvey } = useSurveyController();
  const { handleShowFooter, handleCloseFooter } = useLayoutFooter();

  /** Обновляем локальное состояние */
  useEffect(() => {
    setForm(questions);
    setInitialForm(questions);
  }, [questions]);

  const canSave = useMemo(() => !checkDeepEquals(form, initialForm), [form, initialForm]);

  /**
   * Сохраняет измененное состояние в редакс
   * @returns {void}
   */
  const saveQuestion = useCallback(async (): Promise<void> => {
    dispatch(setLoaderData(true));

    try {
      const data = await saveSurvey(id, { questions: form });

      if (!data) return;

      dispatch(updateSurveyForm(data));
    } catch (error) {
      processError(error);
    } finally {
      dispatch(setLoaderData(false));
    }
  }, [dispatch, processError, form]);

  /**
   * Очищает состояние
   * @returns {void}
   */
  const cancelQuestion = useCallback((): void => {
    setForm(initialForm);
  }, [initialForm]);

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

  /**
   * Обновляет вопрос в списке
   * @param {number} index - индекс вопроса
   * @param {Partial<TQuestion>} upd - обновления вопроса
   * @returns {void}
   */
  const updateQuestion = useCallback((index: number, upd: Partial<TQuestion>): void => {
    setForm(prev =>
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
    setForm(prev => prev.filter((_, i) => i !== index));
  }, []);

  /**
   * Функция для добавления нового вопроса
   * @param {TQuestionType} type - тип вопроса
   * @returns {void}
   */
  const addQuestion = useCallback((type: TQuestionType): void => {
    setForm(prev => {
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
    return form.map((_, i) => ({
      onChange: (upd: Partial<TQuestion>) => updateQuestion(i, upd),
      onRemove: () => removeQuestion(i),
    }));
  }, [form.length, updateQuestion, removeQuestion]);

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

      {form.map((question, questionIndex) => {
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
