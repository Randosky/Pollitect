import type { TQuestion } from "@pages/Survey/Survey.types";

export type TQuestionBaseProps = {
  /** Индекс вопроса */
  index: number;
  /** Количество вопросов */
  questionLength: number;
} & TQuestionProps;

/** Props компонента вопроса */
export type TQuestionProps = {
  /** Данные вопроса */
  item: TQuestion;
  /** Функция удаления вопроса */
  onRemove: () => void;
  /** Функция обновления вопроса */
  onChange: (upd: Partial<TQuestion>) => void;
  /** Функция перемещения вопроса влево */
  onMoveLeft: () => void;
  /** Функция перемещения вопроса вправо */
  onMoveRight: () => void;
};
