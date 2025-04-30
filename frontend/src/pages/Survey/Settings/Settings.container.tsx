// SettingsContainer.tsx
import React, { useCallback, useEffect, useMemo, useState } from "react";

import ActionButtons from "@layout/Footer/ActionButtons";
import { useLayoutFooter } from "@layout/Provider/LayoutFooter";
import { updateDisplaySettings } from "@store/slices/survey";
import checkDeepEquals from "@utils/checkDeepEquals";

import { useAppDispatch, useAppSelector } from "@/store/hooks";

import SettingsView from "./Settings.view";

import type { TDisplaySettings } from "../Survey.types";

const SettingsContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const designSettings = useAppSelector(s => s.survey.surveyForm.display_settings);

  const [form, setForm] = useState<TDisplaySettings>(designSettings);
  const [initialForm, setInitialForm] = useState<TDisplaySettings>(designSettings);
  const [embedCode, setEmbedCode] = useState<string>("");

  const { handleShowFooter, handleCloseFooter } = useLayoutFooter();

  /** Синхронизация стора → локальный стейт */
  useEffect(() => {
    setForm(designSettings);
    setInitialForm(designSettings);
  }, [designSettings]);

  /** Флаг доступности сохранения */
  const canSave = useMemo(() => !checkDeepEquals(form, initialForm), [form, initialForm]);

  /** Обрабатываем изменения формы */
  const handleChange = useCallback((newForm: TDisplaySettings) => setForm(newForm), []);

  /** Сохраняем изменения в Redux и генерируем код */
  const handleSave = useCallback(() => {
    dispatch(updateDisplaySettings(form));

    const code =
      '<script src="https://your.cdn/widget.js" ' +
      `data-blockscroll=\"${form.block_scroll}\" ` +
      `data-preventrepeat=\"${form.prevent_repeat}\" ` +
      `data-timersec=\"${form.timer_sec}\" ` +
      `data-urlmode=\"${form.url_match_mode}\"></script>`;

    setEmbedCode(code);
    setInitialForm(form);
  }, [dispatch, form]);

  /** Отменяем локальные изменения */
  const handleCancel = useCallback(() => setForm(initialForm), [initialForm]);

  /** Показ кнопок футера при наличии изменений */
  useEffect(() => {
    if (canSave) {
      handleShowFooter(
        <ActionButtons
          handleSave={handleSave}
          handleCancel={handleCancel}
        />
      );
    }

    return handleCloseFooter;
  }, [canSave, handleSave, handleCancel, handleShowFooter, handleCloseFooter]);

  return (
    <SettingsView
      settings={form}
      embedCode={embedCode}
      onChange={handleChange}
    />
  );
};

export default SettingsContainer;
