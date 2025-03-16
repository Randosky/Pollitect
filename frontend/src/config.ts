/* eslint-disable sonarjs/no-hardcoded-ip */
/* eslint-disable camelcase */
/* eslint-disable no-inline-comments */
export const SUCCESS_CODE = 200;

/** Текущий пользователь */
export const MOCK_DATA_USER = {
  id: 123,
  name: "Кирилл",
  email: "7yTt1@example.com",
  phone: "+7(999)999-99-99",
  avatar:
    "https://images.unsplash.com/photo-1499714608240-22fc6ad53fb2?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=76&q=80",
};

/** Массив опросов */
export const MOCK_DATA_SURVEYS = [
  {
    id: 21,
    title: "Опрос про качество сервиса",
    description: "Нам важно ваше мнение о качестве обслуживания",
    status: "active", // active | draft | archived
    settings: {
      is_anonymous: true,
      multiple_responses: false,
      response_limit: 100,
      show_progress_bar: true,
      start_date: "2024-03-10T00:00:00Z",
      end_date: "2024-04-10T00:00:00Z",
    },
    design: {
      theme: "light",
      primary_color: "#4A90E2",
      secondary_color: "#FFFFFF",
      background_color: "#F4F4F4",
      text_color: "#333333",
      font_family: "Roboto, sans-serif",
      button_style: "rounded", // rounded | square
    },
    elements: [
      {
        id: 801,
        type: "welcome",
        title: "Добро пожаловать!",
        description: "Спасибо, что нашли время пройти наш опрос",
      },
      {
        id: 802,
        type: "yesno",
        title: "Вам понравилось обслуживание?",
        description: "Выберите один из двух вариантов",
      },
      {
        id: 803,
        type: "choice-single",
        title: "Какую услугу вы заказывали?",
        description: "",
        options: ["Доставка", "Самовывоз", "Консультация"],
      },
      {
        id: 804,
        type: "choice-multiple",
        title: "Что вам понравилось?",
        description: "",
        options: ["Скорость", "Вежливость", "Цена", "Качество"],
      },
      {
        id: 805,
        type: "dropdown",
        title: "Выберите ваш город",
        description: "",
        options: ["Москва", "Санкт-Петербург", "Новосибирск", "Екатеринбург"],
      },
      {
        id: 806,
        type: "input",
        title: "Ваш комментарий",
        description: "Напишите, что можно улучшить",
      },
      {
        id: 807,
        type: "email",
        title: "Оставьте ваш email",
        description: "Чтобы мы могли связаться с вами",
      },
      {
        id: 811,
        type: "thankyou",
        title: "Спасибо!",
        description: "Ваши ответы сохранены",
      },
    ],
    created_at: "2024-03-01T12:00:00Z",
    updated_at: "2024-03-15T16:30:00Z",
  },
  {
    id: 22,
    title: "Оценка сайта",
    description: "Помогите нам сделать сайт удобнее",
    status: "draft",
    settings: {
      is_anonymous: false,
      multiple_responses: true,
      response_limit: null,
      show_progress_bar: false,
      start_date: null,
      end_date: null,
    },
    design: {
      theme: "dark",
      primary_color: "#FF6F61",
      secondary_color: "#1E1E1E",
      background_color: "#121212",
      text_color: "#FFFFFF",
      font_family: "Arial, sans-serif",
      button_style: "square",
    },
    elements: [
      {
        id: 900,
        type: "welcome",
        title: "Приветствуем вас!",
        description: "Ответьте на несколько вопросов о нашем сайте",
      },
      {
        id: 901,
        type: "rating",
        title: "Оцените удобство навигации",
        description: "От 1 до 5",
        scale: 5,
      },
      {
        id: 902,
        type: "input",
        title: "Ваши предложения",
        description: "Как мы можем улучшить сайт?",
      },
      {
        id: 903,
        type: "thankyou",
        title: "Спасибо за отзыв!",
        description: "Нам важно ваше мнение",
      },
    ],
    created_at: "2024-03-05T08:00:00Z",
    updated_at: "2024-03-10T11:00:00Z",
  },
];

/** Завершенные ответы на опросы */
export const MOCK_COMPLETED_ANSWERS = [
  {
    response_id: 1,
    survey_id: 21,
    submitted_at: "2024-03-15T14:30:00Z",
    time_spent_seconds: 320,
    answers: [
      {
        question_id: 802,
        question_text: "Вам понравилось обслуживание?",
        question_type: "yesno",
        answer: true,
      },
      {
        question_id: 803,
        question_text: "Какую услугу вы заказывали?",
        question_type: "choice-single",
        answer: "Доставка",
      },
      {
        question_id: 804,
        question_text: "Что вам понравилось?",
        question_type: "choice-multiple",
        answer: ["Скорость", "Цена"],
      },
      {
        question_id: 805,
        question_text: "Выберите ваш город",
        question_type: "dropdown",
        answer: "Москва",
      },
      {
        question_id: 806,
        question_text: "Ваш комментарий",
        question_type: "input",
        answer: "Все отлично!",
      },
      {
        question_id: 807,
        question_text: "Оставьте ваш email",
        question_type: "email",
        answer: "user@example.com",
      },
      {
        question_id: 811,
        question_text: "Спасибо!",
        question_type: "thankyou",
        answer: "Спасибо за участие!",
      },
    ],
    metadata: {
      country: "Russia",
      device: "desktop",
      browser: "Firefox",
      ip: "192.168.1.1",
    },
  },
  {
    response_id: 2,
    survey_id: 22,
    submitted_at: "2024-03-12T09:00:00Z",
    time_spent_seconds: 120,
    answers: [
      {
        question_id: 901,
        question_text: "Оцените удобство навигации",
        question_type: "rating",
        answer: 4,
      },
      {
        question_id: 902,
        question_text: "Ваши предложения",
        question_type: "input",
        answer: "Добавьте поиск по сайту",
      },
      {
        question_id: 903,
        question_text: "Спасибо за отзыв!",
        question_type: "thankyou",
        answer: "Отлично, спасибо!",
      },
    ],
    metadata: {
      country: "Kazakhstan",
      device: "tablet",
      browser: "Safari",
      ip: "10.0.0.2",
    },
  },
];

/** CRUD состояния для опросов */
export const MOCK_SURVEY_CREATE = {
  status: SUCCESS_CODE,
  message: "Survey created successfully",
  data: {
    id: 23,
    title: "Новый опрос",
    status: "draft",
  },
};

export const MOCK_SURVEY_UPDATE = {
  status: SUCCESS_CODE,
  message: "Survey updated successfully",
};

export const MOCK_SURVEY_DELETE = {
  status: SUCCESS_CODE,
  message: "Survey deleted successfully",
};

/** CRUD состояния для пользователей */
export const MOCK_USER_UPDATE = {
  status: SUCCESS_CODE,
  message: "User updated successfully",
};

export const MOCK_USER_DELETE = {
  status: SUCCESS_CODE,
  message: "User deleted successfully",
};

/** CRUD состояния для ответов */
export const MOCK_RESPONSE_DELETE = {
  status: SUCCESS_CODE,
  message: "Response deleted successfully",
};
