export type TLoginViewProps = {
  /** Поле электронной почты */
  email: string;
  /** Пароль */
  password: string;
  /**
   * Обработчик события отправки формы
   * @param {React.FormEvent<HTMLFormElement>} event - событие отправки формы
   */
  handleSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  /**
   * Обработчик события изменения поля электронной почты
   * @param {React.ChangeEvent<HTMLInputElement>} event - событие изменения поля
   */
  handleEmailChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  /**
   * Обработчик события изменения поля пароля
   * @param {React.ChangeEvent<HTMLInputElement>} event - событие изменения поля
   */
  handlePasswordChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};
