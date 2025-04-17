import type { SurveyCard } from "@store/slices/survey";

export const mockSurveys: SurveyCard[] = [
  {
    id: 1,
    title: "Опрос удовлетворенности клиентов",
    description: "Расскажите, насколько вы довольны качеством нашего сервиса",
  },
  {
    id: 2,
    title: "Исследование рынка",
    description: "Поделитесь своими предпочтениями на рынке IT‑продуктов",
  },
  {
    id: 3,
    title: "Обратная связь по новому интерфейсу",
    description: "Что вам нравится и что можно улучшить в новом дизайне сайта?",
  },
];
