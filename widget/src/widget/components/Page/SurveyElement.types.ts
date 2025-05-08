import { TScreenComponents } from "@services/ComponentService";

import type { TCompletionScreen, TPersonalScreen, TWelcomeScreen } from "@widget/Survey.types";

/** Тип компонента экрана */
export type TScreenComponentsType = "welcome-screen" | "personal-screen" | "completion-screen";

/** Данные компонента экрана */
export type TScreenComponentsData = TWelcomeScreen | TPersonalScreen | TCompletionScreen;

/** Компонент экрана */
export type TScreenComponent = TScreenComponents[keyof TScreenComponents];
