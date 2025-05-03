/* eslint-disable camelcase */
import React, { useCallback } from "react";

import { useFormWithFooter } from "@hooks/useFormWithFooter";
import { useSurveyController } from "@hooks/useSurveyController";
import { useAppSelector } from "@store/hooks";

import type { TScreenDesignSettings, TWelcomeScreen } from "@pages/Survey/Survey.types";

import styles from "./Welcome.module.scss";

/**
 * Экран приветствия с локальным состоянием и кнопками «Сохранить»/«Отменить».
 *
 * Из стора берётся объект welcomeScreen, затем локально клонируется в form и initialForm.
 * При изменении form показываются кнопки управления, при сохранении — диспатч в Redux.
 *
 * @returns {React.ReactElement}
 */
const WelcomeScreen: React.FC = React.memo((): React.ReactElement => {
  const { id, welcomeScreen } = useAppSelector(s => s.survey.surveyForm);

  const { saveSurvey } = useSurveyController();

  /** Функция сохранения формы */
  const saveForm = useCallback(
    async (newForm: TWelcomeScreen) => await saveSurvey(id, { welcomeScreen: newForm }),
    [id, saveSurvey]
  );

  /** Хук для работы с состоянием и футером сохранения состояния */
  const { form, setForm } = useFormWithFooter<TWelcomeScreen>(welcomeScreen, saveForm);

  /**
   * Обработчик изменения полей экрана
   *
   * @param e Событие изменения поля
   */
  const handleFieldChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, type, value, checked } = e.currentTarget as HTMLInputElement;

    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  /**
   * Обработчик изменения настроек дизайна экрана
   *
   * @param e Событие изменения поля дизайна
   */
  const handleDesignChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = e.currentTarget;

    setForm(prev => ({
      ...prev,
      design_settings: {
        ...prev.design_settings,
        [name as keyof TScreenDesignSettings]: value,
      },
    }));
  }, []);

  return (
    <div className={styles.item}>
      <div className={styles.screen}>
        <label className={styles.checkbox}>
          <input
            name="active"
            type="checkbox"
            checked={form.active}
            onChange={handleFieldChange}
          />
          Активировать экран
        </label>

        <div className={styles.field}>
          <label htmlFor="welcome-screen-hint">Подсказка</label>
          <input
            id="welcome-screen-hint"
            type="text"
            name="hint"
            value={form.hint || ""}
            onChange={handleFieldChange}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="welcome-screen-title">Заголовок</label>
          <input
            id="welcome-screen-title"
            name="title"
            type="text"
            required
            value={form.title || ""}
            onChange={handleFieldChange}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="welcome-screen-description">Описание</label>
          <textarea
            id="welcome-screen-description"
            name="description"
            value={form.description || ""}
            onChange={handleFieldChange}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="welcome-screen-button_text">Текст кнопки</label>
          <input
            id="welcome-screen-button_text"
            name="button_text"
            type="text"
            required
            value={form.button_text}
            onChange={handleFieldChange}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="welcome-screen-legal_info">Юридическая информация</label>
          <textarea
            id="welcome-screen-legal_info"
            name="legal_info"
            value={form.legal_info || ""}
            onChange={handleFieldChange}
          />
        </div>

        <div className={styles.design}>
          <h4>Дизайн экрана</h4>

          <div className={styles.field}>
            <label htmlFor="welcome-screen-layout">Схема</label>
            <select
              id="welcome-screen-layout"
              name="layout"
              value={form.design_settings.layout}
              onChange={handleDesignChange}
            >
              <option value="without_image">Без картинки</option>
              <option value="with_image">С картинкой</option>
              <option value="image_background">Картинка фоном</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="welcome-screen-alignment">Выравнивание</label>
            <select
              id="welcome-screen-alignment"
              name="alignment"
              value={form.design_settings.alignment}
              onChange={handleDesignChange}
            >
              <option value="center">По центру</option>
              <option value="left">Слева</option>
              <option value="right">Справа</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="welcome-screen-image_url">URL картинки</label>
            <input
              id="welcome-screen-image_url"
              name="image_url"
              type="text"
              value={form.design_settings.image_url || ""}
              onChange={handleDesignChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
});

WelcomeScreen.displayName = "WelcomeScreen";

export default WelcomeScreen;
