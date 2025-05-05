// src/pages/Constructor/ConstructorView.tsx
import React, { Suspense, lazy, useRef } from "react";

import classNames from "classnames";
import { CSSTransition, SwitchTransition } from "react-transition-group";

import type { TConstuctorTabs, TConstuctorViewProps } from "./Constructor.types";

import pageStyles from "../Survey.module.scss";
import styles from "./Constructor.module.scss";

import TitleEditor from "./TitleEditor";

const Welcome = lazy(() => import("./Screen/Welcome"));
const QuestionList = lazy(() => import("./Question/QuestionList"));
const Personal = lazy(() => import("./Screen/Personal"));
const Completion = lazy(() => import("./Screen/Completion"));

const TAB_COMPONENTS: Record<TConstuctorTabs, React.LazyExoticComponent<React.FC>> = {
  welcome: Welcome,
  questions: QuestionList,
  personal: Personal,
  completion: Completion,
};

const ConstructorView: React.FC<TConstuctorViewProps> = ({ currentTab, setCurrentTab }) => {
  const nodeRef = useRef<HTMLDivElement>(null);

  const ActiveComponent = TAB_COMPONENTS[currentTab];

  return (
    <div className={classNames(pageStyles.page, styles.page)}>
      <nav className={styles.nav}>
        {(["welcome", "questions", "personal", "completion"] as TConstuctorTabs[]).map(tab => (
          <button
            key={tab}
            className={currentTab === tab ? styles.activeTab : undefined}
            onClick={() => setCurrentTab(tab)}
          >
            {
              {
                welcome: "Приветствие",
                questions: "Вопросы",
                personal: "Сбор данных",
                completion: "Завершение",
              }[tab]
            }
          </button>
        ))}
      </nav>

      <TitleEditor />

      <SwitchTransition>
        <CSSTransition
          key={currentTab}
          nodeRef={nodeRef}
          timeout={300}
          classNames={{
            enter: styles.fadeEnter,
            enterActive: styles.fadeEnterActive,
            exit: styles.fadeExit,
            exitActive: styles.fadeExitActive,
          }}
          unmountOnExit
        >
          <div
            ref={nodeRef}
            className={classNames(pageStyles.container, styles.tabContainer)}
          >
            <Suspense fallback={<div>Загрузка...</div>}>
              <ActiveComponent />
            </Suspense>
          </div>
        </CSSTransition>
      </SwitchTransition>
    </div>
  );
};

export default ConstructorView;
