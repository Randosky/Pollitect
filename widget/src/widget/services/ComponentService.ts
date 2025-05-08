import { SurveyElement } from "@components/Page";
import CompletionScreen from "@components/Page/Screen/Completion";
import PersonalScreen from "@components/Page/Screen/Personal";
import WelcomeScreen from "@components/Page/Screen/Welcome";
import { OWNER } from "@widget/vars";

/** Экраны */
export type TScreenComponents = {
  "welcome-screen": WelcomeScreen;
  "personal-screen": PersonalScreen;
  "completion-screen": CompletionScreen;
};

// Финальный список селекторов (включая survey-widget)
export type TSelectorCreate = {
  "survey-widget": SurveyElement;
} & TScreenComponents;

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
  selector: S,
  component: CustomElementConstructor<TSelectorCreate[S]>
): void {
  const ownerSelector = `${OWNER}-${selector}`;

  if (!customElements.get(ownerSelector)) {
    customElements.define(ownerSelector, component);
  }
}

/**
 * Функция для создания готовых веб-компонентов.
 * @param {string} selector Селектор компонента для создания.
 * @returns {HTMLElement} Созданный компонент.
 */
export function createWebComponent<S extends keyof TSelectorCreate>(selector: S): TSelectorCreate[S] {
  const ownerSelector = `${OWNER}-${selector}`;

  return document.createElement(ownerSelector) as TSelectorCreate[S];
}
