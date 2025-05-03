import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import ActionButtons from "@layout/Footer/ActionButtons";
import { useLayoutFooter } from "@layout/Provider/LayoutFooter";
import { useAppDispatch } from "@store/hooks";
import { setLoaderData } from "@store/slices/layout";
import { updateSurveyForm } from "@store/slices/survey";
import checkDeepEquals from "@utils/checkDeepEquals";

import { ISurvey } from "@pages/Survey/Survey.types";

import { useError } from "./useError";
import { useReplaceSurveyId } from "./useReplaceSurveyId";

/**
 * Унифицированный хук для экранов/вкладок редактора опроса.
 *
 * Он:
 * 1. Хранит локальную копию формы (`form`) и её «эталон» `initialForm`.
 * 2. Отслеживает изменения (`canSave`), автоматически показывает / скрывает
 *    футер с кнопками «Сохранить / Отменить».
 * 3. Инкапсулирует типовой `handleSave` с обработкой ошибок и лоадером
 *    (через внешние коллбэки `startLoading`, `stopLoading`, `onError`).
 *
 * @template T – тип объекта формы (например, `TWelcomeScreen`, `TDesignSettings`)
 *
 * @example
 * const { form, setForm } = useFormWithFooter<TWelcomeScreen>({
 *   initial: welcomeScreenFromStore,
 *   saveRequest: data => saveSurvey(id, { welcomeScreen: data }),
 * });
 */
export function useFormWithFooter<T>(
  initial: T,
  saveRequest: (data: T) => Promise<ISurvey | undefined>
): {
  form: T;
  setForm: React.Dispatch<React.SetStateAction<T>>;
} {
  const processError = useError();
  const dispatch = useAppDispatch();
  const replaceUrl = useReplaceSurveyId();

  const [form, setForm] = useState<T>(initial);
  const [initialForm, setInitialForm] = useState<T>(initial);

  /** нужна, чтобы в функции сохранения получать актуальные данные и не иметь проблем с рекурсией */
  const formRef = useRef(form);

  const { handleShowFooter, handleCloseFooter } = useLayoutFooter();

  /* Синхронизация с Redux → локальный стейт */
  useEffect(() => {
    setForm(initial);
    setInitialForm(initial);
  }, [initial]);

  /** Обновляем ссылку на форму */
  useEffect(() => {
    formRef.current = form;
  }, [form]);

  /* Можно ли сохранять? — сравниваем по глубокому равенству */
  const canSave = useMemo(() => !checkDeepEquals(form, initialForm), [form, initialForm]);

  /* Сохранение с обработкой состояний */
  const handleSave = useCallback(async () => {
    dispatch(setLoaderData(true));

    try {
      const data = await saveRequest(formRef.current);

      if (!data) return;

      dispatch(updateSurveyForm(data));

      if (data.id) {
        replaceUrl(data.id);
      }
    } catch (e) {
      processError(e);
    } finally {
      dispatch(setLoaderData(false));
    }
  }, [saveRequest]);

  /* Отмена изменений */
  const handleCancel = useCallback(() => setForm(initialForm), [initialForm]);

  /** Компонент с кнопками */
  const ActionButtonsComponent = useMemo(
    () => (
      <ActionButtons
        handleSave={handleSave}
        handleCancel={handleCancel}
      />
    ),
    [handleCancel, handleSave]
  );

  /* Показываем / скрываем футер при изменении canSave */
  useEffect(() => {
    if (canSave) {
      handleShowFooter(ActionButtonsComponent);
    } else {
      handleCloseFooter();
    }

    return handleCloseFooter;
  }, [canSave]);

  return { form, setForm };
}
