import { SERVER_URL_WIDGET } from "@widget/vars";

import type { TPersonalScreen, TScreenPersonalField } from "@/widget/Survey.types";

import Screen, { type TScreenExternalData } from "../index";

type TPersonalScreenData = TScreenExternalData<TPersonalScreen>;

export default class PersonalScreen extends Screen {
  private externalData?: TPersonalScreenData;
  private form?: HTMLFormElement;

  constructor() {
    super();
  }

  set data(newVal: TPersonalScreenData) {
    this.externalData = newVal;
  }

  get data(): TPersonalScreenData | undefined {
    return this.externalData;
  }

  connectedCallback() {
    this.render();
  }

  render(): void {
    if (!this.data) return;

    const { title, description, design_settings } = this.data.screen;

    /** Сброс перед новым рендером */
    this.shadow.innerHTML = "";

    /** Подключаем стили из Screen и свои */
    this.shadow.appendChild(this.styleScreenElement(design_settings));
    this.shadow.appendChild(this.styleElement());

    /** Корневой контейнер экрана */
    const container = this.createScreenContainer();
    /** Изображение */
    const imageEl = this.createImage(design_settings.image_url);
    /** Блок контента */
    const contentEl = this.createContent();
    /** Хедер с заголовком и описанием */
    const header = this.createHeader();
    /** Заголовок */
    const titleEl = this.createTitle(title);
    /** Описание */
    const descEl = this.createDescription(description);

    /** Форма персональных полей + кнопки */
    this.form = document.createElement("form");
    this.form.className = "screen-form";
    this.renderFields(this.form);

    /** Юридическая информация */
    const legalHtml = `
      Отправляя форму, я принимаю условия
      <a href="/" target="_blank">политики конфиденциальности</a>
      и даю согласие на обработку моих
      <a href="/" target="_blank">персональных данных</a>
    `;
    const legalEl = this.createLegalInfo(legalHtml);

    /** Структура */

    if (titleEl) header.appendChild(titleEl);

    if (descEl) header.appendChild(descEl);

    contentEl.appendChild(header);

    if (legalEl) this.form.appendChild(legalEl);

    if (imageEl) container.appendChild(imageEl);
    container.appendChild(contentEl);
    container.appendChild(this.form);

    this.initEvents();

    this.shadow.appendChild(container);
  }

  /**
   * Рендерит все поля personal_fields и кнопки внутрь формы,
   * а также вешает валидацию обязательных полей
   * @param form — HTMLFormElement, в который добавляются поля
   */
  private renderFields(form: HTMLFormElement): void {
    const requiredInputs: HTMLInputElement[] = [];

    this.data?.screen?.personal_fields?.forEach((field: TScreenPersonalField) => {
      const wrapper = document.createElement("div");

      wrapper.className = "form-field";

      const label = document.createElement("label");

      label.htmlFor = `personal-${field.type}`;
      label.textContent = field.label;

      // маленький кружочек для обязательного поля
      if (field.required) {
        const dot = document.createElement("span");

        dot.className = "required-dot";
        label.appendChild(dot);
      }

      const input = document.createElement("input");

      input.id = `personal-${field.type}`;
      input.name = field.type;
      input.required = field.required;
      input.placeholder = field.placeholder;

      switch (field.type) {
        case "email":
          input.type = "email";
          break;

        case "phone":
          input.type = "tel";
          break;

        default:
          input.type = "text";
      }

      if (field.required) {
        requiredInputs.push(input);
      }

      wrapper.append(label, input);
      form.appendChild(wrapper);
    });

    /** Кнопка «Отправить» */
    const submitBtn = this.createButton(this.data!.screen.button_text);

    submitBtn.type = "submit";
    submitBtn.disabled = true;
    form.appendChild(submitBtn);

    /** Кнопка «Пропустить» */
    const skipBtn = this.createButton("Пропустить", this.data!.onNext);

    skipBtn.classList.add("screen-skip-button");
    form.appendChild(skipBtn);

    /** Проверка валидности всех обязательных полей */
    const updateSubmitState = () => {
      const allFilled = requiredInputs.every(i => i.value.trim().length > 0);

      submitBtn.disabled = !allFilled;
    };

    // при вводе в любом поле — обновляем состояние кнопки
    requiredInputs.forEach(input => {
      input.addEventListener("input", updateSubmitState);
    });
  }

  private initEvents(): void {
    if (!this.form) return;

    this.form.addEventListener("submit", async e => {
      e.preventDefault();

      const surveyId = this.data?.surveyData.id;
      const sessionId = this.store?.getStateByKey("sessionId");

      if (!surveyId || !sessionId) return;

      /** собираем personal */
      const personal: Record<string, string> = {};

      this.data!.screen.personal_fields?.forEach(field => {
        const input = this.form!.elements.namedItem(field.type) as HTMLInputElement;

        if (input) personal[field.type] = encodeURIComponent(input.value.trim());
      });

      try {
        await fetch(`${SERVER_URL_WIDGET}/personal`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ surveyId, sessionId, personal }),
        });

        this.data?.onNext?.();
      } catch (error) {
        console.error(error);
      }
    });
  }

  /** Собственные стили для полей формы и маркера обязательности */
  private styleElement(): HTMLStyleElement {
    const style = document.createElement("style");

    const owner = this.store?.getStateByKey("owner");

    style.textContent = `
      .screen-form {
        z-index: 3;
        gap: 16px;
        display: flex;
        flex-direction: column;
        padding: 16px;
        max-width: 400px;
        overflow-y: auto;
        align-items: flex-end;
        background-color: var(--${owner}-secondary-bg-color);
      }

      .form-field {
        width: 100%;
        display: flex;
        flex-direction: column;
      }

      .form-field label {
        width: fit-content;
        margin-bottom: 6px;
        font-size: var(--${owner}-font-size-description);
        color: var(--${owner}-text-color);
        position: relative;
      }

      .required-dot {
        position: absolute;
        top: 0;
        right: -16px;
        width: 8px;
        height: 8px;
        background-color: var(--${owner}-btn-bg-color);
        border-radius: 50%;
      }

      .form-field input {
        padding: 8px 12px;
        font-size: var(--${owner}-font-size-button);
        border: 1px solid var(--${owner}-btn-bg-color);
        border-radius: 5px;
        background: #fff;
        color: #222;
      }

      .form-field input:focus {
        outline: none;
        box-shadow: 0 0 0 1px var(--${owner}-btn-bg-color);
      }

      .screen-skip-button {
        margin-top: 8px;
        cursor: pointer;
        background: transparent;
        color: var(--${owner}-text-color);
        border: 1px solid var(--${owner}-btn-bg-color);
        font-size: var(--${owner}-font-size-description);
      }

      .screen-form button:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    `;

    return style;
  }
}
