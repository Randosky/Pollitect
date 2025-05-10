/** Типы вкладок при создании опроса */
export type TSurveyTabs = "edit" | "design" | "settings";

/** Интерфейс настроек опроса */
export interface ISurvey {
  /** Идентификатор опроса */
  id?: number;
  /** Название опроса */
  title: string;
  /** Включен ли опрос */
  active: boolean;
  /** Дата последнего обновления */
  updatedAt?: Date;
  /** Дата создания */
  createdAt?: Date;
  /** Массив вопросов и экранов опроса, упорядоченных по порядковому номеру */
  questions: TQuestion[];
  /** Экран приветствия перед началом опроса */
  welcomeScreen: TWelcomeScreen;
  /** Экран сбора персональных данных */
  personalScreen: TPersonalScreen;
  /** Экран окончания опроса */
  completionScreen: TCompletionScreen;
  /** Настройки дизайна виджета опроса */
  design_settings: TDesignSettings;
  /** Настройки отображения (поведение, таймер, условия) */
  display_settings: TDisplaySettings;
  /** Ответы, собранные в ходе прохождения опроса */
  responses: TSessionResponse[];
  /** Статистическая информация по опросу */
  statistics: TSurveyStats;
}

/** Все возможные типы вопросов */
export type TQuestionType = "single" | "multi" | "binary" | "dropdown" | "text" | "textarea" | "date";

/** Все возможные типы экранов */
export type TScreenType = "welcome" | "personal" | "completion";

/** Типы полей для экрана сбора персональных данных */
export type TPersonalFieldType = "name" | "email" | "phone" | "address";

/** Схемы расположения экрана (для экранов без контентного изображения) */
export type TLayout = "without_image" | "with_image" | "image_background";

/** Выравнивание контента на экране */
export type TAlignment = "center" | "left" | "right";

/** Позиция вставки виджета относительно страницы */
export type TPlacement = "inbuilt" | "before" | "after";

/** Доступные семейства шрифтов для текста опроса */
export type TFontFamily = "Inter" | "Open Sans" | "Arial" | "Times New Roman" | "Roboto" | "Montserrat";

/** Возможные вид единиц измерения */
export type TUnit = "%" | "px";

/** Тип для отступов */
export type TIndents = [number, number, number, number];

/** Описание одного вопроса или экрана (до сохранения в БД может не иметь id) */
export type TQuestion = {
  /** Уникальный идентификатор вопроса (назначается сервером) */
  id?: number;
  /** Порядковый номер элемента в структуре опроса */
  order: number;
  /** Обязательность заполнения данного элемента */
  required: boolean;
  /** Тип элемента (вопрос или специальный экран) */
  type: TQuestionType;
  /** Заголовок вопроса или экрана */
  title: string;
  /** Дополнительное описание или подсказка */
  description?: string;
  /** Список вариантов ответа для вопросов с выбором */
  options?: string[];
  /** Логика ветвления: условие перехода к следующему вопросу */
  branching?: TBranching;
};

/** Условие ветвления перехода между вопросами */
export type TBranching = {
  /** Строка-выражение, определяющая условие (например, "value === 'Да'") */
  condition: string;
  /** Следующий вопрос, к которому надо перейти при выполнении условия */
  next_question: TQuestion;
};

/** Настройки экрана приветствия */
export type TWelcomeScreen = {
  /** Активность экрана */
  active: boolean;
  /** Подсказка или краткий текст превью */
  hint?: string;
  /** Заголовок экрана приветствия */
  title?: string;
  /** Описание экрана приветствия */
  description?: string;
  /** Текст кнопки «Начать» */
  button_text: string;
  /** Юридическая информация или согласие */
  legal_info?: string;
  /** Специальные настройки дизайна для экрана */
  design_settings: TScreenDesignSettings;
};

/** Настройки экрана сбора персональных данных */
export type TPersonalScreen = {
  /** Активность экрана */
  active: boolean;
  /** Заголовок экрана */
  title?: string;
  /** Описание условий обработки данных */
  description?: string;
  /** Текст кнопки подтверждения */
  button_text: string;
  /** Конфигурация полей для сбора данных */
  personal_fields?: TScreenPersonalField[];
  /** Настройки дизайна для экрана */
  design_settings: TScreenDesignSettings;
};

/** Настройки экрана завершения опроса */
export type TCompletionScreen = {
  /** Активность экрана */
  active: boolean;
  /** Заголовок экрана завершения */
  title?: string;
  /** Описание после завершения */
  description?: string;
  /** Текст кнопки перехода (например, «Перейти на сайт» ) */
  button_text?: string;
  /** Настройки дизайна для экрана */
  design_settings: TScreenDesignSettings;
};

/** Конфигурация одного поля на экране сбора персональных данных */
export type TScreenPersonalField = {
  /** Тип поля (имя, email, телефон, адрес) */
  type: TPersonalFieldType;
  /** Обязательность заполнения поля */
  required: boolean;
  /** Метка для поля */
  label: string;
  /** Placeholder-атрибут для поля ввода */
  placeholder: string;
};

/** Общие настройки дизайна для экранов (приветствие, персональные данные, завершение) */
export type TScreenDesignSettings = {
  /** Ссылка на изображение для экрана */
  image_url?: string;
  /** Схема расположения контента */
  layout: TLayout;
  /** Выравнивание внутри экрана */
  alignment: TAlignment;
};

/** Основные настройки дизайна виджета опроса */
export type TDesignSettings = {
  /** Способ вставки: встроенный, до или после элемента */
  placement: TPlacement;
  /** Ширина виджета */
  width: number;
  /** Единица измерения ширины */
  width_unit: TUnit;
  /** Высота виджета */
  height: number;
  /** Единица измерения высоты */
  height_unit: TUnit;
  /** Цвет фона виджета */
  background_color: string;
  /** Цвет текста виджета */
  text_color: string;
  /** Цвет кнопок внутри виджета */
  button_color: string;
  /** Выбранное семейство шрифта */
  font_family: TFontFamily;
  /** Скругление краев [top-left, top-right, bottom-right, bottom-left] */
  borderRadius: TIndents;
  /** Отступы внутри виджета [top, right, bottom, left] */
  margin: TIndents;
  /** Поля внутри виджета [top, right, bottom, left] */
  padding: TIndents;
};

/** Настройки поведения отображения опроса */
export type TDisplaySettings = {
  /** HTML‑id контейнера, куда будет вставлен виджет */
  target_id: string;
  /** Блокировать прокрутку страницы при отображении виджета */
  block_scroll: boolean;
  /** Запретить повторное прохождение пользователем */
  prevent_repeat: boolean;
  /** Таймер прохождения опроса в секундах */
  timer_sec: number;
  /** Режим сравнения URL для условия отображения */
  url_match_mode: "contains" | "equals";
  /** Список шаблонов URL для показа виджета */
  url_pattern: string[];
};

/** Тип ответа на один вопрос */
export type TSessionResponse = {
  /** Идентификатор сессии */
  sessionId: number;
  /** Завершен ли опрос */
  isCompleted: boolean;
  /** Имя пользователя */
  name?: string;
  /** Email пользователя */
  email?: string;
  /** Телефон пользователя */
  phone?: string;
  /** Адрес пользователя */
  address?: string;
  /** Ответы в текущей сессии */
  answers: TAnswer[];
};

/** Тип ответа на вопрос */
export type TAnswer = {
  /** Идентификатор вопроса, к которому относится ответ */
  question_id: number;
  /** Значение ответа.
   * — Для вопросов с одиночным выбором и текстовых: строка
   * — Для вопросов с несколькими вариантами: массив строк
   * — Для бинарных вопросов: булевое значение
   * — Для вопросов с датой: ISO-строка даты
   */
  value: string | string[] | boolean;
};

/** Тип статистики по опросу */
export type TSurveyStats = {
  /** Общее число отправленных ответов */
  responsesCount: number;
  /** Процент завершённых прохождений */
  completionRate: number;
  /** Среднее время прохождения опроса в секундах */
  averageTimeSec?: number;
  /** Сессии, завершившие прохождение  */
  completedSessions?: number[];
};
