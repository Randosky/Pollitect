import { OWNER } from "@widget/vars";

import type { TScreenDesignSettings } from "@widget/Survey.types";

export default abstract class Screen extends HTMLElement {
  protected shadow: ShadowRoot;
  private _onNext?: () => void;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  set onNext(newVal: () => void) {
    this._onNext = newVal;
  }

  get onNext(): (() => void) | undefined {
    return this._onNext;
  }

  /** Каждый потомок должен реализовать render(): void */
  protected abstract render(): void;

  /** Корневой контейнер экрана */
  protected createScreenContainer(): HTMLDivElement {
    const container = document.createElement("div");

    container.className = "screen-container";

    return container;
  }

  /** Создаем элемент изображения */
  protected createImage(src?: string, alt?: string): HTMLImageElement | undefined {
    if (!src) return;

    const img = document.createElement("img");

    img.className = "screen-image";
    img.src = src;
    img.alt = alt || "";

    return img;
  }

  /** Создаем элемент с контентом */
  protected createContent(): HTMLDivElement {
    const content = document.createElement("div");

    content.className = "screen-content";

    return content;
  }

  /** Создаем элемент подсказки */
  protected createHint(text?: string): HTMLParagraphElement | undefined {
    if (!text) return;

    const hint = document.createElement("p");

    hint.className = "screen-hint";
    hint.innerHTML = text;

    return hint;
  }

  /** Создаем элемент хедера */
  protected createHeader(): HTMLDivElement {
    const header = document.createElement("div");

    header.className = "screen-header";

    return header;
  }

  /**
   * Создаем элемент заголовока
   * @param text — текст заголовка
   */
  protected createTitle(text?: string): HTMLHeadingElement | undefined {
    if (!text) return;

    const title = document.createElement("h1");

    title.className = "screen-title";
    title.innerHTML = text;

    return title;
  }

  /** Создаем элемент описания под заголовком */
  protected createDescription(text?: string): HTMLParagraphElement | undefined {
    if (!text) return;

    const desc = document.createElement("p");

    desc.className = "screen-description";
    desc.innerHTML = text;

    return desc;
  }

  /** Создаем элемент юридической информации внизу экрана */
  protected createLegalInfo(text?: string): HTMLParagraphElement | undefined {
    if (!text) return;

    const legal = document.createElement("p");

    legal.className = "screen-legal-info";
    legal.innerHTML = text;

    return legal;
  }

  /**
   * Кнопка действия на экране
   * Обычно навешиваете onClick => this.onNext?.()
   */
  protected createButton(text: string, onClick?: () => void): HTMLButtonElement {
    const button = document.createElement("button");

    button.className = "screen-button";
    button.innerHTML = text;
    button.onclick = onClick ?? this.onNext ?? null;

    return button;
  }

  /** Общие стили всех экранов */
  protected styleScreenElement(screenDesignSettings: TScreenDesignSettings): HTMLStyleElement {
    const style = document.createElement("style");

    const { layout, alignment, image_url } = screenDesignSettings;

    /** Стили для выравнивания */
    let alignItems: string;

    switch (alignment) {
      case "left":
        alignItems = "flex-start";
        break;

      case "right":
        alignItems = "flex-end";
        break;

      default:
        alignItems = "center";
    }

    /** Стили для layout */
    let layoutStyles = "";

    switch (layout) {
      case "with_image":
        layoutStyles = `
          .screen-container {
            display: grid;
            grid-template-columns: 1fr 45%;
          }

          .screen-image {
            width: 100%;
            height: 100%;
            display: flex;
            align-items: center;
            justify-content: center;
            object-fit: cover;
            object-position: center;
            background: var(--${OWNER}-secondary-bg-color);
            overflow: hidden;
          }
        `;
        break;

      case "image_background":
        layoutStyles = `
          .screen-container {
            position: static;
          }
          
          .screen-image {
            display: ${image_url ? "block" : "none"};
            top: 0;
            left: 0;
            z-index: 1;
            width: 100%;
            height: 100%;
            position: absolute;
            object-fit: cover;
            object-position: center;
          }

          .screen-content {
            z-index: 2;
          }
        `;
        break;

      default:
        layoutStyles = `
          .screen-image {
            display: none;
          }
        `;
    }

    style.textContent = `
      .screen-container {
        gap: 16px;
        width: 100%;
        height: 100%;
        display: flex;
        box-sizing: border-box;
        border-radius: inherit;
        background: transparent;
      }

      .screen-container * {
        box-sizing: border-box;
        border-radius: inherit;
        color: var(--${OWNER}-text-color);
        font-family: var(--${OWNER}-font-family);
      }

      .screen-content {
        gap: 32px;
        width: 100%;
        height: 100%;
        display: flex;
        overflow-y: auto;
        flex-direction: column;
        text-align: ${alignment};
        align-items: ${alignItems};
      }

      ${layoutStyles}

      .screen-hint {
        margin: 0;
        line-height: 140%;
        overflow-wrap: break-word;
        color: var(--${OWNER}-text-color);
        font-size: var(--${OWNER}-font-size-hint);
      }

      .screen-header {
        gap: 12px;
        display: flex;
        text-align: inherit;
        align-items: inherit;
        flex-direction: column;
      }

      .screen-title {
        margin: 0;
        overflow-wrap: break-word;
        color: var(--${OWNER}-text-color);
        font-size: var(--${OWNER}-font-size-header);
      }

      .screen-description {
        margin: 0;
        overflow-wrap: break-word;
        color: var(--${OWNER}-text-color);
        font-size: var(--${OWNER}-font-size-description);
      }

      .screen-legal-info {
        margin: 0;
        margin-top: auto;
        line-height: 140%;
        overflow-wrap: break-word;
        color: var(--${OWNER}-text-color);
        font-size: var(--${OWNER}-font-size-legal-info);
      }

      .screen-button {
        color: #fff;
        border: none;
        cursor: pointer;
        margin-top: 32px;
        padding: 10px 24px;
        border-radius: 5px;
        width: fit-content;
        height: fit-content;
        color: var(--${OWNER}-btn-color);
        font-size: var(--${OWNER}-font-size-button);
        background-color: var(--${OWNER}-btn-bg-color);
      }

    `;

    return style;
  }
}
