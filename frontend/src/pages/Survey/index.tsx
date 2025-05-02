import React, { ReactElement, useEffect } from "react";

import { useError } from "@hooks/useError";
import { useSurveyController } from "@hooks/useSurveyController";
import Logout from "@layout/Header/Logout";
import { useLayout } from "@layout/Provider/LayoutContext";
import { useAppDispatch, useAppSelector } from "@store/hooks";
import { clearSurveyForm, updateSurveyForm } from "@store/slices/survey";
import { useQuery } from "@tanstack/react-query";
import classNames from "classnames";
import { NavLink, Outlet, useLocation, useNavigate, useParams } from "react-router-dom";

import { SURVEY_TABS, SURVEY_TABS_MAP } from "./Survey.config";

import type { ISurvey } from "./Survey.types";

import styles from "./Survey.module.scss";

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
