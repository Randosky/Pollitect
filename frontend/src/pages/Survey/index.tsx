import React, { ReactElement, useEffect } from "react";

import Logout from "@layout/Header/Logout";
import { useLayout } from "@layout/Provider/LayoutContext";
import { useAppSelector } from "@store/hooks";
import classNames from "classnames";
import { NavLink, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";

import { SURVEY_TABS, SURVEY_TABS_MAP } from "./Survey.config";

import styles from "./Survey.module.scss";

const Survey: React.FC = (): ReactElement => {
  const { surveyId } = useParams<{ surveyId: string }>();

  const { handleShowHeader, handleCloseHeader } = useLayout();

  useEffect(() => {
    if (!SurveyNavigation) return;

    handleShowHeader(<SurveyNavigation surveyId={surveyId} />);

    return handleCloseHeader;
  }, [SurveyNavigation]);

  return (
    <div className={styles.survey}>
      <Outlet />
    </div>
  );
};

const SurveyNavigation: React.FC<{ surveyId?: string }> = ({ surveyId }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const userId = useAppSelector(state => state.user.id);

  const currentTab = SURVEY_TABS.find(tab => new RegExp(`/${tab}/`).test(location.pathname));

  return (
    <div className={styles.header}>
      <button
        className={styles.back_button}
        onClick={() => navigate(`/dashboard/${userId}`)}
      >
        К опросам
      </button>

      <nav className={styles.tabs}>
        {SURVEY_TABS.map(tab => (
          <NavLink
            key={tab}
            to={`/survey/${tab}/${surveyId}`}
            className={classNames(styles.tab, currentTab === tab ? styles.active : null)}
          >
            {SURVEY_TABS_MAP[tab]}
          </NavLink>
        ))}
      </nav>

      <Logout className={styles.logout} />
    </div>
  );
};

export default Survey;
