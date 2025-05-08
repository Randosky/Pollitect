import { TQuestionComponents, TScreenComponents } from "@services/ComponentService";

import type { TCompletionScreen, TPersonalScreen, TQuestion, TWelcomeScreen } from "@widget/Survey.types";

/** Тип компонента экрана */
export type TScreenComponentsType = keyof TScreenComponents;

/** Данные компонента экрана */
export type TScreenComponentsData = TWelcomeScreen | TPersonalScreen | TCompletionScreen;

/** Компонент экрана */
export type TScreenComponent = TScreenComponents[TScreenComponentsType];

/** Тип компонента вопроса */
export type TQuestionComponentsType = `${TQuestion["type"]}-question`;

/** Компонент вопроса */
export type TQuestionComponent = TQuestionComponents[TQuestionComponentsType];
