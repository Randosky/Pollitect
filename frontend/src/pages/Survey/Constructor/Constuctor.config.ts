import type { TPersonalFieldType } from "../Survey.types";
import type { TQuestionType } from "../Survey.types";

/**
 * Отображаемые названия типов вопросов
 */
export const QUESTION_TYPES_MAP: Record<TQuestionType, string> = {
  single: "Одиночный выбор",
  multi: "Множественный выбор",
  binary: "Да/Нет",
  dropdown: "Выпадающий список",
  text: "Текстовый ввод",
  textarea: "Многострочный текст",
  date: "Дата",
};

/**
 * Порядок и перечень доступных типов вопросов в тулбаре
 */
export const QUESTION_TYPES: TQuestionType[] = ["single", "multi", "binary", "dropdown", "text", "textarea", "date"];

export const PERSONAL_SCREEN_FIELDS: TPersonalFieldType[] = ["name", "email", "phone", "address"];
