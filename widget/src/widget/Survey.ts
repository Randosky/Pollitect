/* eslint-disable @typescript-eslint/no-explicit-any */
class Survey {
  private data: any;

  constructor(data: any) {
    this.data = data;
  }

  /**
   * Инициализация виджета
   *
   * @returns {void}
   */
  init(): void {
    console.log("Виджет инициализирован, мы на сайте пользователя");
    console.log("Переданные данные", this.data);
  }
}

(globalThis as any).Survey = Survey;

export default Survey;
