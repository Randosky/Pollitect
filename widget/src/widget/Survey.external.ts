/* eslint-disable @typescript-eslint/no-explicit-any */
class SurveyExternal {
  private data: any;

  constructor(data: any) {
    this.data = data;

    this.init();
  }

  /**
   * Инициализация виджета
   *
   * @returns {void}
   */
  init(): void {
    console.log("Превью виджета инициализировано, мы в кабинете");
    console.log("Переданные данные", this.data);

    this.dada();
  }

  async dada() {
    // eslint-disable-next-line no-magic-numbers
    await new Promise(resolve => setTimeout(() => resolve(console.log("таймер сработал")), 1000));
  }
}

(globalThis as any).SurveyExternal = SurveyExternal;

export default SurveyExternal;
