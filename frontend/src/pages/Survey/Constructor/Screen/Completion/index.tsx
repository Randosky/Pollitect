/* eslint-disable camelcase */
import React, { CSSProperties, useCallback, useMemo } from "react";

import { useFormWithFooter } from "@hooks/useFormWithFooter";
import { useSurveyController } from "@hooks/useSurveyController";
import { useAppSelector } from "@store/hooks";
import Checkbox from "@ui/Checkbox";
import Select from "@ui/Select";
import { TextField } from "@ui/TextField";

import type { TCompletionScreen, TScreenDesignSettings } from "@pages/Survey/Survey.types";

import screenStyles from "../Screen.module.scss";

/**
 * Экран завершения с локальным состоянием и кнопками «Сохранить»/«Отменить».
 *
 * Данные берутся из Redux → клонируются в form и initialForm.
 * При изменении form показываются кнопки управления, при сохранении — диспатч в Redux.
 *
 * @returns {React.ReactElement}
 */
const CompletionScreen: React.FC = React.memo(() => {
  const { id, completionScreen } = useAppSelector(s => s.survey.surveyForm);
  const { saveSurvey } = useSurveyController();

  /** Функция сохранения формы */
  const saveForm = useCallback(
    async (newForm: TCompletionScreen) => await saveSurvey(id, { completionScreen: newForm }),
    [id, saveSurvey]
  );

  /** Хук для работы с состоянием и футером сохранения состояния */
  const { form, setForm } = useFormWithFooter<TCompletionScreen>(completionScreen, saveForm);

  /** Обработчик изменения полей экрана */
  const handleField = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, type, value, checked } = e.currentTarget as HTMLInputElement;

    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  }, []);

  /** Обработчик изменения настроек дизайна экрана */
  const handleDesign = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.currentTarget;

    setForm(prev => ({
      ...prev,
      design_settings: {
        ...prev.design_settings,
        [name as keyof TScreenDesignSettings]: value,
      },
    }));
  }, []);

  /** Стили для body */
  const stylesBody = useMemo<CSSProperties>(() => {
    switch (form.design_settings.layout) {
      case "without_image":
        return {};

      case "with_image":
        return { display: "grid", gridTemplateColumns: "1fr 45%" };

      case "image_background":
        return {
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          backgroundImage: `url(${form.design_settings.image_url})`,
        };

      default:
        return {};
    }
  }, [form.design_settings]);

  /** Стили для content */
  const stylesContent = useMemo<CSSProperties>(() => {
    switch (form.design_settings.alignment) {
      case "left":
        return { justifyContent: "center", alignItems: "flex-start" };

      case "center":
        return { justifyContent: "center", alignItems: "center" };

      case "right":
        return { justifyContent: "center", alignItems: "flex-end" };

      default:
        return {};
    }
  }, [form.design_settings.alignment]);

  return (
    <article className={screenStyles.screen}>
      <Checkbox
        label={form.active ? "Активен" : "Выключен"}
        inputProps={{
          id: "active",
          name: "active",
          checked: form.active,
          onChange: handleField,
        }}
      />

      <div
        style={stylesBody}
        className={screenStyles.body}
      >
        {form.design_settings.layout === "with_image" &&
          (form.design_settings.image_url ? (
            <img
              alt="completion-screen-image"
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
          <div className={screenStyles.headerContainer}>
            <TextField
              size="mobile"
              config={{
                wrapperProps: { className: screenStyles.inputWrapper },
                inputProps: {
                  name: "title",
                  placeholder: "Заголовок",
                  className: screenStyles.header,
                  value: form.title,
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
                  placeholder: "Описание",
                  className: screenStyles.description,
                  value: form.description,
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
                placeholder: "Текст кнопки",
                className: screenStyles.button,
                value: form.button_text,
                onChange: handleField,
              },
            }}
          />
        </div>
      </div>

      <div className={screenStyles.footer}>
        <Select
          size="mobile"
          name="layout"
          value={form.design_settings.layout}
          onChange={handleDesign}
        >
          <option value="without_image">Без картинки</option>
          <option value="with_image">Картинка слева</option>
          <option value="image_background">Фон‑картинка</option>
        </Select>

        <Select
          size="mobile"
          name="alignment"
          value={form.design_settings.alignment}
          onChange={handleDesign}
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
                placeholder: "URL картинки",
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

CompletionScreen.displayName = "CompletionScreen";

export default CompletionScreen;
