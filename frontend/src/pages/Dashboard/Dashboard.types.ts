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
  surveyCards: SurveyCard[];
};

export type TSurveyCardProps = {
  surveyCard: SurveyCard;
};
