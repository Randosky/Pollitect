import React, { useMemo } from "react";

import { useAppDispatch, useAppSelector } from "@store/hooks";
import { openToaster } from "@store/slices/layout";
import Button from "@ui/Button";
import { useCopyToClipboard } from "@uidotdev/usehooks";
import { Link } from "react-router-dom";

import type { TDashboardViewProps } from "./Dashboard.types";

import styles from "./Dashboard.module.scss";

import SurveyCard from "./SurveyCard";

const SERVER_URL = import.meta.env.VITE_SERVER_URL;

const DashboardView: React.FC<TDashboardViewProps> = ({ surveyCards }) => {
  const dispatch = useAppDispatch();

  const [, handleCopy] = useCopyToClipboard();

  const userId = useAppSelector(state => state.user.id);

  /** Скрипт виджета */
  const copyText = useMemo(() => {
    const scriptSrc = `${SERVER_URL}/pollitect.js`;

    return `<script src="${scriptSrc}" type="text/javascript" charset="utf-8" data-user="${userId}" defer></script>`;
  }, [userId]);

  const onClickCopy = () => {
    handleCopy(copyText);

    dispatch(openToaster({ content: "Скрипт скопирован" }));
  };

  return (
    <section className={styles.dashboard}>
      <div className={styles.headerRow}>
        <h1 className={styles.title}>Мои опросы</h1>

        <div className={styles.buttons}>
          <Button
            variant="primary"
            className={styles.copyBtn}
            onClick={onClickCopy}
          >
            Скопировать скрипт
          </Button>

          <Link to="/survey/new/edit">
            <button
              className={styles.createBtn}
              type="button"
            >
              + Создать опрос
            </button>
          </Link>
        </div>
      </div>

      <div className={styles.cardsGrid}>
        {surveyCards?.length
          ? surveyCards.map(surveyCard => (
              <SurveyCard
                key={surveyCard.id}
                surveyCard={surveyCard}
              />
            ))
          : "Нет опросов"}
      </div>
    </section>
  );
};

export default DashboardView;
