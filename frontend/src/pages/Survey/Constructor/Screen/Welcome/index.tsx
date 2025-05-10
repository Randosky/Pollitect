/* eslint-disable camelcase */
import React, { CSSProperties, useCallback, useMemo } from "react";

import { useFormWithFooter } from "@hooks/useFormWithFooter";
import { useSurveyController } from "@hooks/useSurveyController";
import { useAppSelector } from "@store/hooks";
import Select from "@ui/Select";
import { TextField } from "@ui/TextField";

import type { TScreenDesignSettings, TWelcomeScreen } from "@pages/Survey/Survey.types";

import screenStyles from "../Screen.module.scss";

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
  const handleField = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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
  const handleDesign = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;

    setForm(prev => ({
      ...prev,
      design_settings: { ...prev.design_settings, [name as keyof TScreenDesignSettings]: value },
    }));
  }, []);

  /** Стили для body */
  const stylesBody = useMemo<CSSProperties>(() => {
    let returnValue: CSSProperties = {};

    switch (form.design_settings.layout) {
      case "without_image":
        returnValue = {};
        break;

      case "with_image":
        returnValue = {
          display: "grid",
          gridTemplateColumns: "1fr 45%",
        };
        break;

      case "image_background":
        returnValue = {
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundImage: `url(${form.design_settings.image_url})`,
        };
        break;
    }

    return returnValue;
  }, [form.design_settings.image_url, form.design_settings.layout]);

  /** Стили для content */
  const stylesContent = useMemo<CSSProperties>(() => {
    let returnValue: CSSProperties = {};

    switch (form.design_settings.alignment) {
      case "left":
        returnValue = { alignItems: "flex-start" };
        break;

      case "center":
        returnValue = { alignItems: "center" };
        break;

      case "right":
        returnValue = { alignItems: "flex-end" };
        break;
    }

    return returnValue;
  }, [form.design_settings.alignment]);

  return (
    <article className={screenStyles.screen}>
      <div
        style={stylesBody}
        className={screenStyles.body}
      >
        {form.design_settings.layout === "with_image" &&
          (form.design_settings.image_url ? (
            <img
              alt="welcome-screen-image"
              className={screenStyles.image}
              src={form.design_settings.image_url || ""}
            />
          ) : (
            <div className={screenStyles.image}>Изображение</div>
          ))}

        <div
          style={stylesContent}
          className={screenStyles.content}
        >
          <TextField
            autoWidth
            size="mobile"
            config={{
              containerProps: { className: screenStyles.hintContainer },
              wrapperProps: { className: screenStyles.inputWrapper },
              inputProps: {
                name: "hint",
                id: "welcome-screen-hint",
                placeholder: "Подсказка",
                className: screenStyles.hint,
                value: form?.hint ?? "",
                onChange: handleField,
              },
            }}
          />

          <div className={screenStyles.headerContainer}>
            <TextField
              size="mobile"
              config={{
                wrapperProps: { className: screenStyles.inputWrapper },
                inputProps: {
                  name: "title",
                  id: "welcome-screen-title",
                  placeholder: "Заголовок",
                  className: screenStyles.header,
                  value: form?.title ?? "",
                  onChange: handleField,
                },
              }}
            />

            <TextField
              size="mobile"
              type="textarea"
              config={{
                wrapperProps: { className: screenStyles.inputWrapper },
                textAreaProps: {
                  name: "description",
                  id: "welcome-screen-description",
                  placeholder: "Описание",
                  className: screenStyles.description,
                  value: form?.description ?? "",
                  onChange: handleField,
                  rows: 3,
                },
              }}
            />
          </div>

          <TextField
            size="mobile"
            config={{
              containerProps: { className: screenStyles.buttonContainer },
              wrapperProps: { className: screenStyles.buttonWrapper },
              inputProps: {
                name: "button_text",
                id: "welcome-screen-button_text",
                placeholder: "Начать",
                className: screenStyles.button,
                value: form.button_text,
                onChange: handleField,
              },
            }}
          />

          <TextField
            size="mobile"
            config={{
              containerProps: { className: screenStyles.legalInfoContainer },
              wrapperProps: { className: screenStyles.inputWrapper },
              inputProps: {
                name: "legal_info",
                id: "welcome-screen-legal_info",
                placeholder: "Юридическая информация",
                className: screenStyles.legalInfo,
                value: form.legal_info || "",
                onChange: handleField,
              },
            }}
          />
        </div>
      </div>

      <div className={screenStyles.footer}>
        <Select
          size="mobile"
          value={form.design_settings.layout}
          onChange={handleDesign}
          name="layout"
        >
          <option value="without_image">Без картинки</option>
          <option value="with_image">Картинка слева</option>
          <option value="image_background">Фон‑картинка</option>
        </Select>

        <Select
          size="mobile"
          value={form.design_settings.alignment}
          onChange={handleDesign}
          name="alignment"
        >
          <option value="left">Слева</option>
          <option value="center">Центр</option>
          <option value="right">Справа</option>
        </Select>

        {form.design_settings.layout !== "without_image" && (
          <TextField
            size="mobile"
            config={{
              inputProps: {
                name: "image_url",
                placeholder: "URL картинки",
                value: form.design_settings.image_url || "",
                onChange: handleDesign,
              },
            }}
          />
        )}
      </div>
    </article>
  );
});

WelcomeScreen.displayName = "WelcomeScreen";

export default WelcomeScreen;
