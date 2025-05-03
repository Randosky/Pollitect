/* eslint-disable camelcase */
import { useCallback } from "react";

import { useFormWithFooter } from "@hooks/useFormWithFooter";
import { useSurveyController } from "@hooks/useSurveyController";
import { useAppSelector } from "@store/hooks";

import { PERSONAL_SCREEN_FIELDS } from "../../Constuctor.config";

import type {
  TPersonalFieldType,
  TPersonalScreen,
  TScreenDesignSettings,
  TScreenPersonalField,
} from "@pages/Survey/Survey.types";

import styles from "./Personal.module.scss";

/**
 * Экран сбора персональных данных с локальным состоянием и кнопками «Сохранить»/«Отменить».
 *
 * Данные берутся из Redux → клонируются в form и initialForm.
 * При изменении form показываются кнопки управления, при сохранении — диспатч в Redux.
 *
 * @returns {React.ReactElement}
 */
const PersonalScreen: React.FC = (): React.ReactElement => {
  const { id, personalScreen } = useAppSelector(s => s.survey.surveyForm);

  const { saveSurvey } = useSurveyController();

  /** Функция сохранения формы */
  const saveForm = useCallback(
    async (newForm: TPersonalScreen) => await saveSurvey(id, { personalScreen: newForm }),
    [id, saveSurvey]
  );

  /** Хук для работы с состоянием и футером сохранения состояния */
  const { form, setForm } = useFormWithFooter<TPersonalScreen>(personalScreen, saveForm);

  /**
   * Обработчик изменения простых полей (active, title, description, button_text)
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
   * Переключает включение/выключение поля сбора (name, email, phone, address)
   */
  const handleToggleField = useCallback((fieldType: TPersonalFieldType): void => {
    setForm(prev => {
      const fields = prev.personal_fields ?? [];
      const exists = fields.some(f => f.type === fieldType);
      const next = exists
        ? fields.filter(f => f.type !== fieldType)
        : [...fields, { type: fieldType, required: false, label: fieldType, placeholder: "" } as TScreenPersonalField];

      return { ...prev, personal_fields: next };
    });
  }, []);

  /**
   * Обновляет настройки одного поля персональных данных
   */
  const handleSubFieldChange = useCallback((idx: number, upd: Partial<TScreenPersonalField>): void => {
    setForm(prev => {
      const fields = [...(prev.personal_fields ?? [])];

      fields[idx] = { ...fields[idx], ...upd };

      return { ...prev, personal_fields: fields };
    });
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
          Активировать сбор персональных данных
        </label>

        <div className={styles.field}>
          <label htmlFor="personal-title">Заголовок</label>
          <input
            id="personal-title"
            name="title"
            type="text"
            value={form.title || ""}
            onChange={handleFieldChange}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="personal-description">Описание</label>
          <textarea
            id="personal-description"
            name="description"
            value={form.description || ""}
            onChange={handleFieldChange}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="personal-button_text">Текст кнопки</label>
          <input
            id="personal-button_text"
            name="button_text"
            type="text"
            value={form.button_text}
            onChange={handleFieldChange}
          />
        </div>

        <fieldset className={styles.checkboxGroup}>
          <legend>Поля для сбора</legend>
          {PERSONAL_SCREEN_FIELDS.map(f => (
            <label
              key={f}
              className={styles.checkbox}
            >
              <input
                type="checkbox"
                checked={form.personal_fields?.some(p => p.type === f) || false}
                onChange={() => handleToggleField(f)}
              />
              {f}
            </label>
          ))}
        </fieldset>

        {form.personal_fields?.map((field, idx) => (
          <div
            key={idx}
            className={styles.field}
          >
            <h5>{field.type}</h5>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={field.required}
                onChange={e => handleSubFieldChange(idx, { required: e.currentTarget.checked })}
              />
              Обязательное
            </label>
            <label htmlFor={`label-${idx}`}>Метка</label>
            <input
              id={`label-${idx}`}
              type="text"
              value={field.label}
              onChange={e => handleSubFieldChange(idx, { label: e.currentTarget.value })}
            />
            <label htmlFor={`placeholder-${idx}`}>Placeholder</label>
            <input
              id={`placeholder-${idx}`}
              type="text"
              value={field.placeholder}
              onChange={e => handleSubFieldChange(idx, { placeholder: e.currentTarget.value })}
            />
          </div>
        ))}

        <div className={styles.design}>
          <h4>Дизайн экрана</h4>
          <div className={styles.field}>
            <label htmlFor="personal-layout">Схема</label>
            <select
              id="personal-layout"
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
            <label htmlFor="personal-alignment">Выравнивание</label>
            <select
              id="personal-alignment"
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
            <label htmlFor="personal-image_url">URL картинки</label>
            <input
              id="personal-image_url"
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

export default PersonalScreen;
