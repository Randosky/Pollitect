import React, { useCallback } from "react";

import { useFormWithFooter } from "@hooks/useFormWithFooter";
import { useSurveyController } from "@hooks/useSurveyController";
import { openToaster } from "@store/slices/layout";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

import SettingsView from "./Settings.view";

import type { ISurvey, TDisplaySettings } from "../Survey.types";

const SettingsContainerComponent: React.FC = () => {
  const dispatch = useAppDispatch();

  const { id, display_settings: designSettings } = useAppSelector(s => s.survey.surveyForm);

  const { saveSurvey } = useSurveyController();

  /** Функция валидации */
  const validateDisplaySettings = useCallback((form: TDisplaySettings): boolean => {
    if (form.target_id.trim() === "") {
      dispatch(openToaster({ content: "Идентификатор контейнера не может быть пустым" }));

      return false;
    }

    const hasUrlPatterns = form.url_pattern.length > 0 && form.url_pattern.some(url => url.trim() !== "");

    if (!hasUrlPatterns) {
      dispatch(openToaster({ content: "Необходимо указать хотя бы один шаблон URL" }));

      return false;
    }

    return true;
  }, []);

  /** Функция сохранения формы */
  const saveForm = useCallback(
    async (newForm: TDisplaySettings): Promise<ISurvey | undefined> => {
      if (!validateDisplaySettings(newForm)) return;

      return await saveSurvey(id, { display_settings: newForm });
    },
    [id, saveSurvey, validateDisplaySettings]
  );

  /** Хук для работы с состоянием и футером сохранения состояния */
  const { form, setForm } = useFormWithFooter<TDisplaySettings>(designSettings, saveForm);

  /** Обрабатываем изменения формы */
  const handleChange = useCallback((upd: Partial<TDisplaySettings>) => setForm(prev => ({ ...prev, ...upd })), []);

  return (
    <SettingsView
      settings={form}
      onChange={handleChange}
    />
  );
};

export const SettingsContainer = React.memo(SettingsContainerComponent);
