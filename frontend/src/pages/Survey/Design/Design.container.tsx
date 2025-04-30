import React, { useCallback, useEffect, useMemo, useState } from "react";

import { updateDesignSettings } from "@store/slices/survey";
import checkDeepEquals from "@utils/checkDeepEquals";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

import DesignView from "./Design.view";

import { TDesignSettings } from "../Survey.types";

const DesignContainer: React.FC = () => {
  const dispatch = useAppDispatch();

  const designSettings = useAppSelector(s => s.survey.surveyForm.design_settings);

  const [form, setForm] = useState<TDesignSettings>(designSettings);
  const [initialForm, setInitialForm] = useState<TDesignSettings>(designSettings);

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
  const handleSave = useCallback((): void => {
    dispatch(updateDesignSettings(form));
  }, [dispatch, form]);

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
