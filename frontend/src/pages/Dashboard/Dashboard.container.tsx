// src/pages/Dashboard/Dashboard.container.tsx
import React, { useEffect, useState } from "react";

import authAxiosInstance from "@api/authInstance";
import { useError } from "@hooks/useError";
import Logout from "@layout/Header/Logout";
import { useLayout } from "@layout/Provider/LayoutContext";
import { useNavigate } from "react-router-dom";

import DashboardView from "./Dashboard.view";

import { mockSurveys } from "./Dashboard.config";

import type { SurveyCard } from "./Dashboard.types";

const DashboardContainer: React.FC = () => {
  const navigate = useNavigate();
  const proccessError = useError();

  const { handleShowHeader, handleCloseHeader } = useLayout();

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
