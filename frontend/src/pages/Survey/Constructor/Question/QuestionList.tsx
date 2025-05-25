import { useCallback, useEffect, useMemo, useRef } from "react";

import Question from ".";
import { useFormWithFooter } from "@hooks/useFormWithFooter";
import { useSurveyController } from "@hooks/useSurveyController";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { openToaster } from "@store/slices/layout";
import Button from "@ui/Button";

import { QUESTION_TYPES, QUESTION_TYPES_MAP } from "../Constuctor.config";

import type { ISurvey, TQuestion, TQuestionType } from "@pages/Survey/Survey.types";

import styles from "./Question.module.scss";

const QuestionList = () => {
  const dispatch = useAppDispatch();

  const { id, questions } = useAppSelector(state => state.survey.surveyForm);

  const questionsRef = useRef<HTMLDivElement | null>(null);

  const { saveSurvey } = useSurveyController();

  /** Функция валидации вопросов */
  const validateQuestions = useCallback((questions: TQuestion[]): boolean => {
    for (let i = 0; i < questions.length; i++) {
      const question = questions[i];
      const questionIndex = i + 1;

      // Проверка наличия заголовка
      if (question.title.trim() === "") {
        dispatch(openToaster({ content: `У вопроса №${questionIndex} отсутствует заголовок` }));

        return false;
      }

      // Проверка наличия вариантов, если поле options есть
      if (["single", "multi", "dropdown"].includes(question.type)) {
        const hasValidOption = question.options?.some(opt => opt.trim() !== "");

        if (!hasValidOption) {
          dispatch(
            openToaster({ content: `У вопроса №${questionIndex} необходимо указать хотя бы один вариант ответа` })
          );

          return false;
        }
      }
    }

    return true;
  }, []);

  /** Функция сохранения формы */
  const saveForm = useCallback(
    async (newForm: TQuestion[]): Promise<ISurvey | undefined> => {
      if (!validateQuestions(newForm)) return;

      return await saveSurvey(id, { questions: newForm });
    },
    [id, saveSurvey]
  );

  /** Хук для работы с состоянием и футером сохранения состояния */
  const { form, setForm } = useFormWithFooter<TQuestion[]>(questions, saveForm);

  /** Проскролливаем до добавленного вопроса */
  useEffect(() => {
    if (!form.length || questions.length === form.length) return;

    questionsRef.current?.scroll({ left: questionsRef.current?.scrollWidth });
  }, [questions.length, form.length]);

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
   * Переместить вопрос влево: меняем местами его и предыдущий
   */
  const moveLeft = useCallback(
    (index: number): void => {
      if (index <= 0) return;

      setForm(prev => {
        const left = prev[index - 1];
        const curr = prev[index];

        // строим новый массив
        return prev.map((q, i) => {
          if (i === index - 1) {
            // на месте left теперь curr, но с его старым order
            return { ...curr, order: left.order };
          }

          if (i === index) {
            // на месте curr теперь left, но с его старым order
            return { ...left, order: curr.order };
          }

          return q;
        });
      });
    },
    [setForm]
  );

  /**
   * Переместить вопрос вправо: меняем местами его и следующий
   */
  const moveRight = useCallback(
    (index: number): void => {
      setForm(prev => {
        if (index < 0 || index >= prev.length - 1) return prev;

        const curr = prev[index];
        const right = prev[index + 1];

        return prev.map((q, i) => {
          if (i === index) {
            // curr мчится вправо, получает order у right
            return { ...right, order: curr.order };
          }

          if (i === index + 1) {
            // right движется влево, получает order у curr
            return { ...curr, order: right.order };
          }

          return q;
        });
      });
    },
    [setForm]
  );
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

  /** Мемоизированные хендлеры */
  const handlers = useMemo(() => {
    return form.map((_, i) => ({
      onChange: (upd: Partial<TQuestion>) => updateQuestion(i, upd),
      onRemove: () => removeQuestion(i),
      onMoveLeft: () => moveLeft(i),
      onMoveRight: () => moveRight(i),
    }));
  }, [form.length, updateQuestion, removeQuestion, moveLeft, moveRight]);

  return (
    <div className={styles.questionPage}>
      <aside className={styles.sidebar}>
        {QUESTION_TYPES.map(type => (
          <Button
            key={type}
            className={styles.sidebar__button}
            onClick={() => addQuestion(type)}
          >
            {QUESTION_TYPES_MAP[type]}
          </Button>
        ))}
      </aside>

      <div
        ref={questionsRef}
        className={styles.questionList}
      >
        {form
          .slice()
          .sort((a, b) => a.order - b.order)
          .map((question, questionIndex) => {
            return (
              <Question
                {...handlers[questionIndex]}
                item={question}
                index={questionIndex}
                questionLength={form.length}
                key={`${questionIndex}-${question.order}`}
              />
            );
          })}
      </div>
    </div>
  );
};

export default QuestionList;
