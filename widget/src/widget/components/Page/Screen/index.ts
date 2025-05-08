export default abstract class Screen extends HTMLElement {
  protected shadow: ShadowRoot;
  public onNext?: () => void;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }

  /**
   * Каждый потомок обязан реализовать отрисовку:
   * - прочитать свои данные,
   * - вставить всё в this.shadow,
   * - задать обработчики,
   * - вызвать this.onNext().
   */
  protected abstract render(): void;
}
