import Logout from "@layout/Header/Logout";
import { useAppSelector } from "@store/hooks";
import classNames from "classnames";
import { NavLink, useLocation, useNavigate } from "react-router-dom";

import { SURVEY_TABS, SURVEY_TABS_MAP } from "../Survey.config";

import styles from "./Navigation.module.scss";

/**
 * Компонент навигации на странице опроса.
 * @param {string} [surveyId] - ID опроса.
 * @returns {ReactElement} - навигационное меню.
 */
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

export default SurveyNavigation;
