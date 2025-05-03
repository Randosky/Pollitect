/* eslint-disable camelcase */
import React, { useCallback } from "react";

import { useFormWithFooter } from "@hooks/useFormWithFooter";
import { useSurveyController } from "@hooks/useSurveyController";

import { useAppSelector } from "@/store/hooks";

import SettingsView from "./Settings.view";

import type { TDisplaySettings } from "../Survey.types";

const SettingsContainerComponent: React.FC = () => {
  const { id, display_settings: designSettings } = useAppSelector(s => s.survey.surveyForm);

  const { saveSurvey } = useSurveyController();

  /** Функция сохранения формы */
  const saveForm = useCallback(
    async (newForm: TDisplaySettings) => await saveSurvey(id, { display_settings: newForm }),
    [id, saveSurvey]
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
