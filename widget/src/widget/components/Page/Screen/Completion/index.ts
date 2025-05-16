import { setCookie } from "@services/CookieService";
import { SERVER_URL_WIDGET } from "@widget/vars";

import type { TCompletionScreen } from "@/widget/Survey.types";

import Screen, { type TScreenExternalData } from "../index";

type TCompletionScreenData = TScreenExternalData<TCompletionScreen>;

export default class CompletionScreen extends Screen {
  private externalData?: TCompletionScreenData;
  private finishBtn?: HTMLButtonElement;

  constructor() {
    super();

    this.store?.subscribe("surveyTimer", this.handleChangeSurveyTimer);
  }

  set data(newVal: TCompletionScreenData) {
    this.externalData = newVal;
  }

  get data(): TCompletionScreenData | undefined {
    return this.externalData;
  }

  connectedCallback() {
    this.render();
  }

  handleChangeSurveyTimer = (prev: number, next: number): void => {
    if (next !== 0) return;

    console.log(next);

    this.finishSurvey();
  };

  render(): void {
    if (!this.data) return;

    const { title, description, button_text, design_settings } = this.data.screen;

    /** Сброс перед рендером */
    this.shadow.innerHTML = "";

    /** Базовые стили экрана */
    this.shadow.appendChild(this.styleScreenElement(design_settings));
    /** Стили для completionScreen */
    this.shadow.appendChild(this.styleElement());

    /** Корневой контейнер экрана */
    const container = this.createScreenContainer();

    /** Картинка (если указано) */
    const imageEl = this.createImage(design_settings.image_url);

    if (imageEl) container.appendChild(imageEl);

    /** Блок контента с дополнительным классом */
    const contentEl = this.createContent();

    contentEl.classList.add("completion-content");

    /** Хедер */
    const header = this.createHeader();
    const titleEl = this.createTitle(title);
    const descEl = this.createDescription(description);

    if (titleEl) header.appendChild(titleEl);

    if (descEl) header.appendChild(descEl);
    contentEl.appendChild(header);

    /** Кнопка завершения, если есть */
    if (button_text) {
      this.finishBtn = document.createElement("button");

      this.finishBtn.className = "screen-button";
      this.finishBtn.textContent = button_text;
      contentEl.appendChild(this.finishBtn);
    }

    container.appendChild(contentEl);

    this.initEvents();

    this.shadow.appendChild(container);
  }

  private initEvents(): void {
    if (!this.finishBtn) return;

    this.finishBtn.addEventListener("click", this.finishSurvey);
  }

  /** Функция завершения опроса */
  private finishSurvey = async (): Promise<void> => {
    const surveyId = this.data?.surveyData.id;
    const sessionId = this.store?.getStateByKey("sessionId");
    const timer = this.store?.getStateByKey("surveyTimer");

    if (!sessionId || !surveyId) return;

    try {
      await fetch(`${SERVER_URL_WIDGET}/complete`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sessionId, surveyId, timer }),
      });

      /** Возвращаем скролл */
      document.body.style.removeProperty("overflow");

      /** Устанавливаем куки о прохождении */
      setCookie(`survey_${this.data?.surveyData?.id}_completed`, "true");

      /** Очищаем sessionId для этого survey */
      sessionStorage.removeItem(`survey_${surveyId}_session`);

      this.showSuccess();
    } catch (error) {
      this.finishBtn!.disabled = true;
      this.finishBtn!.textContent = "Ошибка, попробуйте позже";
      console.error(error);
    }
  };

  /**
   * Заменяет содержимое на красивую анимацию успеха
   */
  private showSuccess(): void {
    const { design_settings } = this.data!.screen;

    /** Сброс перед рендером */
    this.shadow.innerHTML = "";

    /** Базовые стили экрана */
    this.shadow.appendChild(this.styleScreenElement(design_settings));
    /** Стили для completionScreen */
    this.shadow.appendChild(this.styleElement());

    const successContainer = document.createElement("div");

    successContainer.className = "success-container";

    // SVG-галочка
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

    svg.setAttribute("viewBox", "0 0 52 52");
    svg.classList.add("success-icon");
    svg.innerHTML = `
      <circle cx="26" cy="26" r="25" fill="none" stroke-width="2"/>
      <path fill="none" stroke-width="3" d="M14 24 l10 10 l14 -14"/>
    `;

    const msg = document.createElement("p");

    msg.className = "success-text";
    msg.textContent = "Ваши ответы сохранены";

    successContainer.append(svg, msg);
    this.shadow.appendChild(successContainer);
  }

  private styleElement(): HTMLStyleElement {
    const style = document.createElement("style");

    const owner = this.store?.getStateByKey("owner");

    style.textContent = `
      .completion-content {
        justify-content: center;
      }

      .success-container {
        position: absolute;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1rem;
        animation: fadeIn 0.5s ease-out forwards;
      }

      .success-icon {
        width: 80px;
        height: 80px;
        stroke: var(--${owner}-btn-bg-color);
        stroke-dasharray: 166;
        stroke-dashoffset: 166;
        animation: draw 0.7s ease-out forwards;
      }

      .success-icon circle {
        stroke-opacity: 0.3;
        animation: circleFade 0.7s ease-out forwards;
      }

      .success-text {
        font-size: 1.2rem;
        color: var(--${owner}-text-color);
        text-align: center;
      }

      @keyframes draw {
        0% {
          stroke-dashoffset: 166;
        }
        100% {
          stroke-dashoffset: 0;
        }
      }

      @keyframes circleFade {
        0% { stroke-dashoffset: 166; }
        100% { stroke-dashoffset: 0; }
      }

      @keyframes fadeIn {
        from { opacity: 0; transform: translate(-50%, -60%); }
        to   { opacity: 1; transform: translate(-50%, -50%); }
      }
    `;

    return style;
  }
}
