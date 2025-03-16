import React from "react";

import { Link } from "react-router-dom";

import { MOCK_DATA_SURVEYS } from "@/config";

import type { TDashboardViewProps } from "./Dashboard.types";

const DashboardView: React.FC<TDashboardViewProps> = () => {
  return (
    <div>
      <div>
        <h1>Мои опросы</h1>

        <button type="button">Создать опрос</button>
      </div>

      <div>
        {MOCK_DATA_SURVEYS.map(survey => (
          <Link
            key={survey.id}
            to={`/quiz/edit/${survey.id}`}
          >
            <article>
              <div>{survey.title}</div>
              <h2>{survey.description}</h2>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default DashboardView;
