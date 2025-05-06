import { createWebComponent, registerWebComponent } from "@components/ComponentService";

import type { ISurvey } from "./Survey.types";

import { SurveyElement } from "./SurveyElement";

registerWebComponent("survey-widget", SurveyElement);

class Survey {
  constructor(data: ISurvey) {
    const element = createWebComponent("survey-widget");

    element.initialize(data);

    return element;
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
(globalThis as any).Survey = Survey;
export default Survey as unknown as new (data: ISurvey) => SurveyElement;
