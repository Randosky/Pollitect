import { SurveyElement } from "@widget/SurveyElement";
import { OWNER } from "@widget/vars";

// Финальный список селекторов (включая survey-widget)
type TSelectorCreate = {
  "survey-widget": SurveyElement;
};

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
