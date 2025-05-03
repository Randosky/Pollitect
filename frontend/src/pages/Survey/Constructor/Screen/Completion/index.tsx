/* eslint-disable camelcase */
import { useCallback } from "react";

import { useFormWithFooter } from "@hooks/useFormWithFooter";
import { useSurveyController } from "@hooks/useSurveyController";
import { useAppSelector } from "@store/hooks";

import type { TCompletionScreen, TScreenDesignSettings } from "@pages/Survey/Survey.types";

import styles from "./Completion.module.scss";

/**
 * Экран завершения с локальным состоянием и кнопками «Сохранить»/«Отменить».
 *
 * Данные берутся из Redux → клонируются в form и initialForm.
 * При изменении form показываются кнопки управления, при сохранении — диспатч в Redux.
 *
 * @returns {React.ReactElement}
 */
const CompletionScreen: React.FC = (): React.ReactElement => {
  const { id, completionScreen } = useAppSelector(s => s.survey.surveyForm);

  const { saveSurvey } = useSurveyController();

  /** Функция сохранения формы */
  const saveForm = useCallback(
    async (newForm: TCompletionScreen) => await saveSurvey(id, { completionScreen: newForm }),
    [id, saveSurvey]
  );

  /** Хук для работы с состоянием и футером сохранения состояния */
  const { form, setForm } = useFormWithFooter<TCompletionScreen>(completionScreen, saveForm);

  /**
   * Обработчик изменения простых полей
   */
  const handleFieldChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const target = e.currentTarget as HTMLInputElement;
    const { name, type, value, checked } = target;

    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  /**
   * Обработчик изменения дизайна экрана
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
          Активировать экран завершения
        </label>

        <div className={styles.field}>
          <label htmlFor="completion-title">Заголовок</label>
          <input
            id="completion-title"
            name="title"
            type="text"
            value={form.title || ""}
            onChange={handleFieldChange}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="completion-description">Описание</label>
          <textarea
            id="completion-description"
            name="description"
            value={form.description || ""}
            onChange={handleFieldChange}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="completion-button_text">Текст кнопки</label>
          <input
            id="completion-button_text"
            name="button_text"
            type="text"
            value={form.button_text || ""}
            onChange={handleFieldChange}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="completion-button_url">URL кнопки</label>
          <input
            id="completion-button_url"
            name="button_url"
            type="text"
            value={form.button_url || ""}
            onChange={handleFieldChange}
          />
        </div>

        <div className={styles.design}>
          <h4>Дизайн экрана</h4>
          <div className={styles.field}>
            <label htmlFor="completion-layout">Схема</label>
            <select
              id="completion-layout"
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
            <label htmlFor="completion-alignment">Выравнивание</label>
            <select
              id="completion-alignment"
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
            <label htmlFor="completion-image_url">URL картинки</label>
            <input
              id="completion-image_url"
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
};

export default CompletionScreen;
