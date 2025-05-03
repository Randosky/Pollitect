/* eslint-disable camelcase */
import React, { useCallback } from "react";

import { useFormWithFooter } from "@hooks/useFormWithFooter";
import { useSurveyController } from "@hooks/useSurveyController";

import { useAppSelector } from "@/store/hooks";

import DesignView from "./Design.view";

import type { TDesignSettings } from "../Survey.types";

const DesignContainer: React.FC = () => {
  const { id, design_settings: designSettings } = useAppSelector(s => s.survey.surveyForm);

  const { saveSurvey } = useSurveyController();

  /** Функция сохранения формы */
  const saveForm = useCallback(
    async (newForm: TDesignSettings) => await saveSurvey(id, { design_settings: newForm }),
    [id, saveSurvey]
  );

  /** Хук для работы с состоянием и футером сохранения состояния */
  const { form, setForm } = useFormWithFooter<TDesignSettings>(designSettings, saveForm);

  /**
   * Обработчик изменений настроек
   * @param {Partial<TDesignSettings>} upd — новые поля
   */
  const handleChange = useCallback((upd: Partial<TDesignSettings>): void => {
    setForm(prev => ({ ...prev, ...upd }));
  }, []);

  return (
    <DesignView
      settings={form}
      onChange={handleChange}
    />
  );
};

export { DesignContainer };
