import { useMemo } from "react";

import surveyAxiosInstance from "@api/surveyInstance";
import { useAppSelector } from "@store/hooks";

import type { ISurvey } from "@pages/Survey/Survey.types";

/**
 * Хук для работы с CRUD-операциями над ресурсом опросов
 */
export function useSurveyController() {
  // Оборачиваем инстанс в useMemo, чтобы не пересоздавать его на каждый ререндер
  const client = useMemo(() => surveyAxiosInstance, []);
  const surveyForm = useAppSelector(state => state.survey.surveyForm);

  /**
   * Получить все опросы текущего пользователя
   * @returns {Promise<ISurvey[]>}
   */
  async function fetchSurveys(): Promise<ISurvey[]> {
    const res = await client.get<ISurvey[]>("/");

    return res.data;
  }

  /**
   * Получить один опрос по ID
   * @param {number} id - идентификатор опроса
   * @returns {Promise<ISurvey>}
   */
  async function fetchSurveyById(id: number): Promise<ISurvey> {
    const res = await client.get<ISurvey>(`/${id}`);

    return res.data;
  }

  /**
   * Создать новый опрос
   * @param {Omit<ISurvey, "id">} survey - данные нового опроса без поля id
   * @returns {Promise<ISurvey>}
   */
  async function createSurvey(survey: Omit<ISurvey, "id">): Promise<ISurvey> {
    const res = await client.post<ISurvey>("/", survey);

    return res.data;
  }

  /**
   * Обновить существующий опрос
   * @param {number} id - идентификатор опроса
   * @param {ISurvey} survey - новые данные опроса
   * @returns {Promise<ISurvey>}
   */
  async function updateSurvey(id: number, survey: Partial<ISurvey>): Promise<ISurvey> {
    const res = await client.patch<ISurvey>(`/${id}`, survey);

    return res.data;
  }

  /**
   * Создать или обновить опрос
   * @param {number} id - идентификатор опроса
   * @param {ISurvey} survey - новые данные опроса
   * @returns {Promise<ISurvey>}
   */
  async function saveSurvey(id: number | undefined, survey: Partial<ISurvey>): Promise<ISurvey | undefined> {
    if (!id || id < 0) {
      if (!window.location.pathname.match(/\/survey/)) return;

      return createSurvey({ ...surveyForm, ...survey });
    }

    return updateSurvey(id, survey);
  }

  /**
   * Удалить опрос по ID
   * @param {number} id - идентификатор опроса
   * @returns {Promise<void>}
   */
  async function deleteSurvey(id: number): Promise<void> {
    await client.delete<void>(`/${id}`);
  }

  return {
    fetchSurveys,
    fetchSurveyById,
    createSurvey,
    updateSurvey,
    saveSurvey,
    deleteSurvey,
  };
}
