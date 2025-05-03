/* eslint-disable camelcase */
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useError } from "@hooks/useError";
import { useSurveyController } from "@hooks/useSurveyController";
import ActionButtons from "@layout/Footer/ActionButtons";
import { useLayoutFooter } from "@layout/Provider/LayoutFooter";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { setLoaderData } from "@store/slices/layout";
import { updateSurveyForm } from "@store/slices/survey";
import checkDeepEquals from "@utils/checkDeepEquals";

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
  const dispatch = useAppDispatch();
  const processError = useError();

  const { id, personalScreen } = useAppSelector(s => s.survey.surveyForm);

  const [form, setForm] = useState<TPersonalScreen>(personalScreen);
  const [initialForm, setInitialForm] = useState<TPersonalScreen>(personalScreen);

  const { saveSurvey } = useSurveyController();
  const { handleShowFooter, handleCloseFooter } = useLayoutFooter();

  /** Синхронизируем стор → локальный стейт */
  useEffect(() => {
    setForm(personalScreen);
    setInitialForm(personalScreen);
  }, [personalScreen]);

  /** Флаг доступности сохранения */
  const canSave = useMemo(() => !checkDeepEquals(form, initialForm), [form, initialForm]);

  /**
   * Сохраняет локальные изменения в Redux
   */
  const handleSave = useCallback(async (): Promise<void> => {
    dispatch(setLoaderData(true));

    try {
      const data = await saveSurvey(id, { personalScreen: form });

      if (!data) return;

      dispatch(updateSurveyForm(data));
    } catch (error) {
      processError(error);
    } finally {
      dispatch(setLoaderData(false));
    }
  }, [dispatch, processError, form]);

  /**
   * Отменяет локальные изменения, восстанавливая начальное состояние
   */
  const handleCancel = useCallback((): void => {
    setForm(initialForm);
  }, [initialForm]);

  /** Показ кнопок футера при наличии изменений */
  useEffect(() => {
    if (canSave) {
      handleShowFooter(
        <ActionButtons
          handleSave={handleSave}
          handleCancel={handleCancel}
        />
      );
    }

    return handleCloseFooter;
  }, [canSave, handleSave, handleCancel]);

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
