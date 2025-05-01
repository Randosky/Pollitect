import { ISurvey } from "@pages/Survey/Survey.types";

/** Интерфейсы карточки опроса */
export interface SurveyCard {
  id: number;
  title: string;
  description: string;
  responsesCount: number;
  completionRate: number;
  updatedAt: string;
}

export type TDashboardViewProps = {
  surveyCards?: ISurvey[];
};

export type TSurveyCardProps = {
  surveyCard: ISurvey;
};
