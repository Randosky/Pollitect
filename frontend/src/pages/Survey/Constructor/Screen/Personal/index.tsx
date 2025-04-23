/* eslint-disable camelcase */
import React, { useCallback } from "react";

import { useAppDispatch, useAppSelector } from "@store/hooks";
import { updatePersonalScreen } from "@store/slices/survey";

import { PERSONAL_SCREEN_FIELDS } from "../../Constuctor.config";

import type { TPersonalFieldType, TScreenPersonalField } from "@pages/Survey/Survey.types";

import styles from "./Personal.module.scss";

/**
 * Компонент экрана сбора персональных данных
 */
const PersonalScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const personal = useAppSelector(s => s.survey.surveyForm.personalScreen);

  /**
   * Обновляет простые поля экрана (active, title, description, button_text)
   */
  const updateInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;

      dispatch(
        updatePersonalScreen({
          ...personal,
          [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        })
      );
    },
    [dispatch, personal]
  );

  /**
   * Переключает включение/выключение поля сбора (name, email, phone, address)
   */
  const toggleField = useCallback(
    (type: TPersonalFieldType) => {
      const fields = personal.personal_fields ?? [];
      const exists = fields.some(f => f.type === type);
      const next = exists
        ? fields.filter(f => f.type !== type)
        : [...fields, { type, required: false, label: type, placeholder: "" } as TScreenPersonalField];

      dispatch(updatePersonalScreen({ ...personal, personal_fields: next }));
    },
    [dispatch, personal]
  );

  /**
   * Обновляет настройки одного поля персональных данных
   */
  const updateField = useCallback(
    (idx: number, upd: Partial<TScreenPersonalField>) => {
      const fields = [...(personal.personal_fields ?? [])];

      fields[idx] = { ...fields[idx], ...upd };
      dispatch(updatePersonalScreen({ ...personal, personal_fields: fields }));
    },
    [dispatch, personal]
  );

  /**
   * Обновляет дизайн-опции экрана
   */
  const updateDesign = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.currentTarget;

      dispatch(
        updatePersonalScreen({
          ...personal,
          design_settings: {
            ...personal.design_settings,
            [name]: value,
          },
        })
      );
    },
    [dispatch, personal]
  );

  return (
    <div className={styles.item}>
      <h3 className={styles.sectionTitle}>Экран сбора данных</h3>

      <div className={styles.screen}>
        <label className={styles.checkbox}>
          <input
            name="active"
            type="checkbox"
            checked={personal.active}
            onChange={updateInput}
          />{" "}
          Активировать сбор персональных данных
        </label>

        <div className={styles.field}>
          <label htmlFor="personal-title">Заголовок</label>
          <input
            id="personal-title"
            name="title"
            type="text"
            value={personal.title || ""}
            onChange={updateInput}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="personal-description">Описание</label>
          <textarea
            id="personal-description"
            name="description"
            value={personal.description || ""}
            onChange={updateInput}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="personal-button_text">Текст кнопки</label>
          <input
            id="personal-button_text"
            name="button_text"
            type="text"
            value={personal.button_text}
            onChange={updateInput}
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
                checked={personal.personal_fields?.some(p => p.type === f) || false}
                onChange={() => toggleField(f)}
              />{" "}
              {f}
            </label>
          ))}
        </fieldset>

        {personal.personal_fields?.map((field, idx) => (
          <div
            key={idx}
            className={styles.field}
          >
            <h5>{field.type}</h5>
            <label className={styles.checkbox}>
              <input
                type="checkbox"
                checked={field.required}
                onChange={e => updateField(idx, { required: e.target.checked })}
              />{" "}
              Обязательное
            </label>
            <label htmlFor={`label-${idx}`}>Метка</label>
            <input
              id={`label-${idx}`}
              type="text"
              value={field.label}
              onChange={e => updateField(idx, { label: e.target.value })}
            />
            <label htmlFor={`placeholder-${idx}`}>Placeholder</label>
            <input
              id={`placeholder-${idx}`}
              type="text"
              value={field.placeholder}
              onChange={e => updateField(idx, { placeholder: e.target.value })}
            />
          </div>
        ))}

        <div className={styles.design}>
          <h4>Дизайн экрана</h4>

          <div className={styles.field}>
            <label htmlFor="layout-select">Схема</label>
            <select
              id="layout-select"
              name="layout"
              value={personal.design_settings.layout}
              onChange={updateDesign}
            >
              <option value="without_image">Без картинки</option>
              <option value="with_image">С картинкой</option>
              <option value="image_background">Картинка фоном</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="alignment-select">Выравнивание</label>
            <select
              id="alignment-select"
              name="alignment"
              value={personal.design_settings.alignment}
              onChange={updateDesign}
            >
              <option value="center">По центру</option>
              <option value="left">Слева</option>
              <option value="right">Справа</option>
            </select>
          </div>

          <div className={styles.field}>
            <label htmlFor="image-url">URL картинки</label>
            <input
              id="image-url"
              name="image_url"
              type="text"
              value={personal.design_settings.image_url || ""}
              onChange={updateDesign}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PersonalScreen;
