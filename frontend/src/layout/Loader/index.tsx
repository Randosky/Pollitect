import React, { useEffect, useState } from "react";

import { useAppSelector } from "@store/hooks";
import classNames from "classnames";

import styles from "./Loader.module.scss";

const LOADER_TIMER_HOLD = 150;

const Loader = () => {
  const show = useAppSelector(state => state.layout.loader.show);
  const [hidden, setHidden] = useState(!show);

  useEffect(() => {
    if (show) {
      setHidden(false);
    } else {
      const timeoutId = setTimeout(() => setHidden(true), LOADER_TIMER_HOLD);

      return () => clearTimeout(timeoutId);
    }
  }, [show]);

  if (hidden) return <></>;

  return (
    <div className={styles.loader}>
      <div className={styles.skcircle}>
        <div className={classNames(styles.skcircle1, styles.skchild)}></div>
        <div className={classNames(styles.skcircle2, styles.skchild)}></div>
        <div className={classNames(styles.skcircle3, styles.skchild)}></div>
        <div className={classNames(styles.skcircle4, styles.skchild)}></div>
        <div className={classNames(styles.skcircle5, styles.skchild)}></div>
        <div className={classNames(styles.skcircle6, styles.skchild)}></div>
        <div className={classNames(styles.skcircle7, styles.skchild)}></div>
        <div className={classNames(styles.skcircle8, styles.skchild)}></div>
        <div className={classNames(styles.skcircle9, styles.skchild)}></div>
        <div className={classNames(styles.skcircle10, styles.skchild)}></div>
        <div className={classNames(styles.skcircle11, styles.skchild)}></div>
        <div className={classNames(styles.skcircle12, styles.skchild)}></div>
      </div>
    </div>
  );
};

export default Loader;
