import React, { useEffect } from "react";

import { useError } from "@hooks/useError";
import { useSurveyController } from "@hooks/useSurveyController";
import Logout from "@layout/Header/Logout";
import { useLayout } from "@layout/Provider/LayoutContext";
import { useAppDispatch } from "@store/hooks";
import { setLoaderData } from "@store/slices/layout";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import DashboardView from "./Dashboard.view";

import type { ISurvey } from "@pages/Survey/Survey.types";

const DashboardContainer: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const proccessError = useError();

  const { fetchSurveys } = useSurveyController();
  const { handleShowHeader, handleCloseHeader } = useLayout();

  /** Получить все опросы */
  const { data: surveyCards } = useQuery<ISurvey[] | null>({
    queryKey: ["getSurveys"],
    queryFn: async () => {
      dispatch(setLoaderData(true));

      try {
        const data = await fetchSurveys();

        if (!data?.length) return null;

        return data;
      } catch (error) {
        proccessError(error);

        return null;
      } finally {
        dispatch(setLoaderData(false));
      }
    },
    refetchOnMount: "always",
    refetchOnReconnect: true,
    refetchOnWindowFocus: true,
  });

  /** Настроить заголовок */
  useEffect(() => {
    handleShowHeader(
      <div style={{ width: "100%", display: "flex", justifyContent: "space-between" }}>
        <button
          type="button"
          onClick={() => navigate("/")}
        >
          На главную
        </button>
        <Logout />
      </div>
    );

    return handleCloseHeader;
  }, []);

  return <DashboardView surveyCards={surveyCards} />;
};

export { DashboardContainer };
