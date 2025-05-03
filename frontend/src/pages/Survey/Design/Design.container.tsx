/* eslint-disable camelcase */
import React, { useCallback, useEffect, useMemo, useState } from "react";

import { useError } from "@hooks/useError";
import { useSurveyController } from "@hooks/useSurveyController";
import { setLoaderData } from "@store/slices/layout";
import { updateSurveyForm } from "@store/slices/survey";
import checkDeepEquals from "@utils/checkDeepEquals";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

import DesignView from "./Design.view";

import type { TDesignSettings } from "../Survey.types";

const DesignContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const processError = useError();

  const { id, design_settings: designSettings } = useAppSelector(s => s.survey.surveyForm);

  const [form, setForm] = useState<TDesignSettings>(designSettings);
  const [initialForm, setInitialForm] = useState<TDesignSettings>(designSettings);

  const { saveSurvey } = useSurveyController();

  /** Синхронизируем стор → локальный стейт */
  useEffect(() => {
    setForm(designSettings);
    setInitialForm(designSettings);
  }, [designSettings]);

  /** Флаг доступности сохранения */
  const canSave = useMemo(() => !checkDeepEquals(form, initialForm), [form, initialForm]);

  /**
   * Сохраняет локальные изменения в Redux
   * @returns {void}
   */
  const handleSave = useCallback(async (): Promise<void> => {
    dispatch(setLoaderData(true));

    try {
      const data = await saveSurvey(id, { design_settings: form });

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
   * @returns {void}
   */
  const handleCancel = useCallback((): void => {
    setForm(initialForm);
  }, [initialForm]);

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
      canSave={canSave}
      onChange={handleChange}
      handleSave={handleSave}
      handleCancel={handleCancel}
    />
  );
};

export { DesignContainer };
