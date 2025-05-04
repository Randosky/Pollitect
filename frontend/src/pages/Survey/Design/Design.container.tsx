/* eslint-disable camelcase */
import React, { useCallback, useState } from "react";

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

  /* «фон сайта» живёт локально */
  const [siteBg, setSiteBg] = useState<string>("#f2f0f0");
  /* «фон элемента на сайте» живёт локально */
  const [siteElementBg, setSiteElementBg] = useState<string>("#aed2d7");

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
      siteBg={siteBg}
      siteElementBg={siteElementBg}
      onChange={handleChange}
      setSiteBg={setSiteBg}
      setSiteElementBg={setSiteElementBg}
    />
  );
};

export { DesignContainer };
