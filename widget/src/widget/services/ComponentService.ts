import { SurveyElement } from "@components/Page";
import Binary from "@components/Page/Question/Binary";
import DateQuestion from "@components/Page/Question/Date";
import DropdownQuestion from "@components/Page/Question/Dropdown";
import MultiQuestion from "@components/Page/Question/Multi";
import SingleQuestion from "@components/Page/Question/Single";
import TextQuestion from "@components/Page/Question/Text";
import TextareaQuestion from "@components/Page/Question/Textarea";
import CompletionScreen from "@components/Page/Screen/Completion";
import PersonalScreen from "@components/Page/Screen/Personal";
import WelcomeScreen from "@components/Page/Screen/Welcome";

/** Экраны */
export type TScreenComponents = {
  "welcome-screen": WelcomeScreen;
  "personal-screen": PersonalScreen;
  "completion-screen": CompletionScreen;
};

/** Вопросы */
export type TQuestionComponents = {
  "binary-question": Binary;
  "date-question": DateQuestion;
  "dropdown-question": DropdownQuestion;
  "multi-question": MultiQuestion;
  "single-question": SingleQuestion;
  "text-question": TextQuestion;
  "textarea-question": TextareaQuestion;
};

// Финальный список селекторов (включая survey-widget)
export type TSelectorCreate = {
  "survey-widget": SurveyElement;
} & TScreenComponents &
  TQuestionComponents;

// Кастомный тип конструктора HTMLElement
type CustomElementConstructor<T = HTMLElement> = {
  new (): T;
};

/**
 * Регистрация одного компонента.
 * @param {string} selector Селектор для регистрации компонента.
 * @param {CustomElementConstructor} component Класс компонента, который нужно зарегистрировать.
 * @returns {void}
 */
export function registerWebComponent<S extends keyof TSelectorCreate>(
  owner: string,
  selector: S,
  component: CustomElementConstructor<TSelectorCreate[S]>
): void {
  const ownerSelector = `${owner}-${selector}`;

  if (!customElements.get(ownerSelector)) {
    customElements.define(ownerSelector, component);
  }
}

/**
 * Функция для создания готовых веб-компонентов.
 * @param {string} selector Селектор компонента для создания.
 * @returns {HTMLElement} Созданный компонент.
 */
export function createWebComponent<S extends keyof TSelectorCreate>(owner: string, selector: S): TSelectorCreate[S] {
  const ownerSelector = `${owner}-${selector}`;

  return document.createElement(ownerSelector) as TSelectorCreate[S];
}
