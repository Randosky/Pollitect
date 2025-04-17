// src/pages/Dashboard/Dashboard.container.tsx
import React, { useEffect, useState } from "react";

import authAxiosInstance from "@api/authInstance";
import { useError } from "@hooks/useError";
import { type SurveyCard } from "@store/slices/survey";

import DashboardView from "./Dashboard.view";

import { mockSurveys } from "./Dashboard.config";

const DashboardContainer: React.FC = () => {
  const proccessError = useError();

  const [surveyCards, setSurveyCards] = useState<SurveyCard[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const res = await authAxiosInstance.get<SurveyCard[]>("/surveys");

        if (res.data && res.data.length > 0) {
          setSurveyCards(res.data);
        } else {
          setSurveyCards(mockSurveys);
        }
      } catch (error) {
        proccessError(error);

        setSurveyCards(mockSurveys);
      }
    })();
  }, []);

  return <DashboardView surveyCards={surveyCards} />;
};

export { DashboardContainer };
