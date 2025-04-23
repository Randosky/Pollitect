/* eslint-disable camelcase */
import React, { useCallback } from "react";

import { useAppDispatch, useAppSelector } from "@store/hooks";
import { updateCompletionScreen } from "@store/slices/survey";

import styles from "./Completion.module.scss";

/** Компонент экрана завершения опроса */
const CompletionScreen: React.FC = () => {
  const dispatch = useAppDispatch();
  const completion = useAppSelector(s => s.survey.surveyForm.completionScreen);

  /**
   * Обновляет простые поля экрана (active, title, description, button_text, button_url)
   */
  const updateInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value, type } = e.target;

      dispatch(
        updateCompletionScreen({
          ...completion,
          [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
        })
      );
    },
    [dispatch, completion]
  );

  /**
   * Обновляет дизайн-опции экрана
   */
  const updateDesign = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.currentTarget;

      dispatch(
        updateCompletionScreen({
          ...completion,
          design_settings: {
            ...completion.design_settings,
            [name]: value,
          },
        })
      );
    },
    [dispatch, completion]
  );

  return (
    <div className={styles.item}>
      <h3 className={styles.sectionTitle}>Экран завершения</h3>

      <div className={styles.screen}>
        <label className={styles.checkbox}>
          <input
            name="active"
            type="checkbox"
            checked={completion.active}
            onChange={updateInput}
          />
          Активировать экран завершения
        </label>

        <div className={styles.field}>
          <label htmlFor="completion-title">Заголовок</label>
          <input
            id="completion-title"
            name="title"
            type="text"
            value={completion.title || ""}
            onChange={updateInput}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="completion-description">Описание</label>
          <textarea
            id="completion-description"
            name="description"
            value={completion.description || ""}
            onChange={updateInput}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="completion-button_text">Текст кнопки</label>
          <input
            id="completion-button_text"
            name="button_text"
            type="text"
            value={completion.button_text || ""}
            onChange={updateInput}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="completion-button_url">URL кнопки</label>
          <input
            id="completion-button_url"
            name="button_url"
            type="text"
            value={completion.button_url || ""}
            onChange={updateInput}
          />
        </div>

        <div className={styles.design}>
          <h4>Дизайн экрана</h4>

          <div className={styles.field}>
            <label htmlFor="layout-select">Схема</label>
            <select
              id="layout-select"
              name="layout"
              value={completion.design_settings.layout}
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
              value={completion.design_settings.alignment}
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
              value={completion.design_settings.image_url || ""}
              onChange={updateDesign}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompletionScreen;
