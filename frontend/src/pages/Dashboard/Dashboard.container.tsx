// src/pages/Dashboard/Dashboard.container.tsx
import React, { useEffect, useState } from "react";

import authAxiosInstance from "@api/authInstance";
import { useError } from "@hooks/useError";
import Logout from "@layout/Header/Logout";
import { useLayout } from "@layout/LayoutContext";
import { type SurveyCard } from "@store/slices/survey";

import DashboardView from "./Dashboard.view";

import { mockSurveys } from "./Dashboard.config";

const DashboardContainer: React.FC = () => {
  const proccessError = useError();

  const { handleShowHeader, handleCloseHeader } = useLayout();

  useEffect(() => {
    handleShowHeader(<Logout />);

    return handleCloseHeader;
  }, []);

  const [surveyCards, setSurveyCards] = useState<SurveyCard[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const { data } = await authAxiosInstance.get<SurveyCard[]>("/surveys");

        if (!data?.length) return;

        setSurveyCards(data);
      } catch (error) {
        proccessError(error);

        setSurveyCards(mockSurveys);
      }
    })();
  }, []);

  return <DashboardView surveyCards={surveyCards} />;
};

export { DashboardContainer };
