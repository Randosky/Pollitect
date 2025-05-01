import React, { useEffect } from "react";

import { useError } from "@hooks/useError";
import { useSurveyController } from "@hooks/useSurveyController";
import Logout from "@layout/Header/Logout";
import { useLayout } from "@layout/Provider/LayoutContext";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

import DashboardView from "./Dashboard.view";

import { ISurvey } from "@pages/Survey/Survey.types";

const DashboardContainer: React.FC = () => {
  const navigate = useNavigate();
  const proccessError = useError();

  const { fetchSurveys } = useSurveyController();
  const { handleShowHeader, handleCloseHeader } = useLayout();

  /** Получить все опросы */
  const { data: surveyCards } = useQuery<ISurvey[] | undefined>({
    queryKey: ["getSurveys"],
    queryFn: async () => {
      try {
        const data = await fetchSurveys();

        if (!data?.length) return;

        return data;
      } catch (error) {
        proccessError(error);
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
