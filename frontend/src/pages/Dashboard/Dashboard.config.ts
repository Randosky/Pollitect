import { SurveyCard } from "./Dashboard.types";

export const mockSurveys: SurveyCard[] = [
  {
    id: 1,
    title: "Опрос удовлетворенности клиентов",
    description: "Расскажите, насколько вы довольны качеством нашего сервиса.",
    responsesCount: 124,
    completionRate: 85,
    updatedAt: "17.04.2025",
  },
  {
    id: 2,
    title: "Исследование рынка IT-продуктов",
    description: "Поделитесь своими предпочтениями и потребностями на IT-рынке.",
    responsesCount: 78,
    completionRate: 92,
    updatedAt: "15.04.2025",
  },
  {
    id: 3,
    title: "Обратная связь по новому интерфейсу",
    description: "Что вам нравится и что можно улучшить в нашем новом дизайне?",
    responsesCount: 45,
    completionRate: 60,
    updatedAt: "10.04.2025",
  },
];
