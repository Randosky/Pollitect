/* eslint-disable @typescript-eslint/no-explicit-any */
class Survey {
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
    console.log("Виджет инициализирован, мы на сайте пользователя");
    console.log("Переданные данные", this.data);

    this.dada();
  }

  async dada() {
    // eslint-disable-next-line no-magic-numbers
    await new Promise(resolve => setTimeout(() => resolve(console.log("таймер сработал")), 3000));
  }
}

(globalThis as any).Survey = Survey;

export default Survey;
