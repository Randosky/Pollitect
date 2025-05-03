import React, { ReactElement, useEffect } from "react";

import { useError } from "@hooks/useError";
import { useSurveyController } from "@hooks/useSurveyController";
import { useLayout } from "@layout/Provider/LayoutContext";
import { useAppDispatch } from "@store/hooks";
import { clearSurveyForm, updateSurveyForm } from "@store/slices/survey";
import { useQuery } from "@tanstack/react-query";
import { Outlet, useParams } from "react-router-dom";

import type { ISurvey } from "./Survey.types";

import SurveyNavigation from "./Navigation";

/**
 * Страница для работы с опросом
 * @returns JSX.Element
 */
const Survey: React.FC = (): ReactElement => {
  const dispatch = useAppDispatch();
  const processError = useError();

  const { surveyId } = useParams<{ surveyId: string }>();
  const surveyIdNumber = Number(surveyId);

  const { fetchSurveyById } = useSurveyController();
  const { handleShowHeader, handleCloseHeader } = useLayout();

  /** Из запроса получаем данные текущего опроса */
  useQuery<ISurvey | null>({
    queryKey: ["getSurveyById"],
    queryFn: async () => {
      if (isNaN(surveyIdNumber) || surveyIdNumber < 0) return null;

      try {
        const data = await fetchSurveyById(surveyIdNumber);

        dispatch(updateSurveyForm(data));

        return data;
      } catch (error) {
        processError(error);

        return null;
      }
    },
    refetchOnMount: "always",
  });

  /** Очищаем редакс при выходе */
  useEffect(() => {
    return () => {
      dispatch(clearSurveyForm());
    };
  }, []);

  /** Делаем хедер */
  useEffect(() => {
    if (!SurveyNavigation) return;

    handleShowHeader(<SurveyNavigation surveyId={surveyId} />);

    return handleCloseHeader;
  }, [surveyId, SurveyNavigation]);

  return <Outlet />;
};

export default Survey;
