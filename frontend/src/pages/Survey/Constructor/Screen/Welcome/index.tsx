/* eslint-disable camelcase */
import React, { useCallback } from "react";

import { useAppDispatch, useAppSelector } from "@store/hooks";
import { updateWelcomeScreen } from "@store/slices/survey";

import type { TScreenDesignSettings } from "@pages/Survey/Survey.types";

import styles from "./Welcome.module.scss";

/**
 * Компонент экрана приветствия
 */
const WelcomeScreen = () => {
  const dispatch = useAppDispatch();

  const welcomeScreen = useAppSelector(state => state.survey.surveyForm.welcomeScreen);

  /**
   * Обработчик изменений в инпутах
   * @param {React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>} event - событие изменения инпута
   * @returns {void}
   */
  const updateInput = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value, type } = event.currentTarget;

      dispatch(
        updateWelcomeScreen({
          ...welcomeScreen,
          [name]: type === "checkbox" ? (event.target as HTMLInputElement).checked : value,
        })
      );
    },
    [dispatch, welcomeScreen]
  );

  /**
   * Обработчик изменений в инпутах дизайна
   * @param {React.ChangeEvent<HTMLInputElement | HTMLSelectElement>} event - событие изменения инпута
   * @returns {void}
   */
  const updateDesign = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = event.currentTarget;

      dispatch(
        updateWelcomeScreen({
          ...welcomeScreen,
          design_settings: { ...welcomeScreen.design_settings, [name as keyof TScreenDesignSettings]: value },
        })
      );
    },
    [dispatch, welcomeScreen]
  );

  return (
    <div className={styles.item}>
      <h3 className={styles.sectionTitle}>Экран приветствия</h3>

      <div className={styles.screen}>
        <label className={styles.checkbox}>
          <input
            name="active"
            type="checkbox"
            checked={welcomeScreen.active}
            onChange={updateInput}
          />
          Активировать экран
        </label>

        <div className={styles.field}>
          <label htmlFor="welcome-screen-hint">Подсказка</label>

          <input
            id="welcome-screen-hint"
            type="text"
            name="hint"
            value={welcomeScreen.hint || ""}
            onChange={updateInput}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="welcome-screen-title">Заголовок</label>
          <input
            id="welcome-screen-title"
            required
            type="text"
            name="title"
            value={welcomeScreen.title || ""}
            onChange={updateInput}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="welcome-screen-description">Описание</label>
          <textarea
            id="welcome-screen-description"
            name="description"
            value={welcomeScreen.description || ""}
            onChange={updateInput}
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="welcome-screen-button_text">Текст кнопки</label>
          <input
            id="welcome-screen-button_text"
            type="text"
            name="button_text"
            value={welcomeScreen.button_text}
            onChange={updateInput}
            required
          />
        </div>

        <div className={styles.field}>
          <label htmlFor="welcome-screen-legal_info">Юридическая информация</label>
          <textarea
            id="welcome-screen-legal_info"
            name="legal_info"
            value={welcomeScreen.legal_info || ""}
            onChange={updateInput}
          />
        </div>

        <div className={styles.design}>
          <h4>Дизайн экрана</h4>

          <div className={styles.field}>
            <label htmlFor="welcome-screen-layout">Схема</label>
            <select
              id="welcome-screen-layout"
              name="layout"
              value={welcomeScreen.design_settings.layout}
              onChange={updateDesign}
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
              value={welcomeScreen.design_settings.alignment}
              onChange={updateDesign}
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
              type="text"
              name="image_url"
              value={welcomeScreen.design_settings.image_url || ""}
              onChange={updateDesign}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WelcomeScreen;
