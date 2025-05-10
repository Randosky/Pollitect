import type { TWelcomeScreen } from "@/widget/Survey.types";

import Screen, { type TScreenExternalData } from "../index";

type TWelcomeScreenData = TScreenExternalData<TWelcomeScreen>;

export default class WelcomeScreen extends Screen {
  private externalData?: TWelcomeScreenData;
  private nextButton?: HTMLButtonElement;

  constructor() {
    super();
  }

  set data(newVal: TWelcomeScreenData) {
    this.externalData = newVal;
  }

  get data(): TWelcomeScreenData | undefined {
    return this.externalData;
  }

  connectedCallback() {
    this.render();
  }

  render(): void {
    if (!this.data) return;

    const { hint, title, description, button_text, legal_info, design_settings } = this.data.screen;

    /** Очищаем элемент перед новым рендером */
    this.shadow.innerHTML = "";

    /** Стили */
    this.shadow.appendChild(this.styleScreenElement(design_settings));

    /** Корневой контейнер */
    const container = this.createScreenContainer();
    /** Изображение */
    const imageEl = this.createImage(design_settings?.image_url);
    /** Контент */
    const contentEl = this.createContent();
    /** Подсказка */
    const hintEl = this.createHint(hint);
    /** Заголовок и описание в общей шапке */
    const header = this.createHeader();
    /** Заголовок */
    const titleEl = this.createTitle(title);
    /** Описание */
    const descriptionEl = this.createDescription(description);
    /** Юридическая информация */
    const legalEl = this.createLegalInfo(legal_info);

    /** Кнопка «Далее» */
    this.nextButton = this.createButton(button_text);

    if (imageEl) container.appendChild(imageEl);

    container.appendChild(contentEl);

    if (hintEl) contentEl.appendChild(hintEl);

    if (titleEl) header.appendChild(titleEl);

    if (descriptionEl) header.appendChild(descriptionEl);

    contentEl.appendChild(header);

    if (this.nextButton) contentEl.appendChild(this.nextButton);

    if (legalEl) contentEl.appendChild(legalEl);

    this.initEvents();

    this.shadow.appendChild(container);
  }

  initEvents(): void {
    if (!this.nextButton) return;

    /** Кнпока далее */
    this.nextButton.addEventListener("click", () => {
      if (this.data?.surveyData.display_settings.block_scroll) document.body.style.overflow = "hidden";

      this.data?.onNext();
    });
  }
}
