export default class Screen extends HTMLElement {
  protected shadow: ShadowRoot;
  public onNext?: () => void;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });
  }
}
