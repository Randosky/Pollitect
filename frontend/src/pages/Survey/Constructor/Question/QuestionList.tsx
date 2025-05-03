import { useCallback, useMemo } from "react";

import Question from ".";
import { useFormWithFooter } from "@hooks/useFormWithFooter";
import { useSurveyController } from "@hooks/useSurveyController";
import { useAppSelector } from "@store/hooks";

import { QUESTION_TYPES } from "../Constuctor.config";

import type { TQuestion, TQuestionType } from "@pages/Survey/Survey.types";

import styles from "./Question.module.scss";

const QuestionList = () => {
  const { id, questions } = useAppSelector(state => state.survey.surveyForm);

  const { saveSurvey } = useSurveyController();

  /** Функция сохранения формы */
  const saveForm = useCallback(
    async (newForm: TQuestion[]) => await saveSurvey(id, { questions: newForm }),
    [id, saveSurvey]
  );

  /** Хук для работы с состоянием и футером сохранения состояния */
  const { form, setForm } = useFormWithFooter<TQuestion[]>(questions, saveForm);

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
