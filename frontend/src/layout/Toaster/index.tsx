/* eslint-disable */
import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@store/hooks";
import { closeToaster } from "@store/slices/layout";
import classNames from "classnames";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import styles from "./Toaster.module.scss";

/** Контенер для рендера списка тостеров */
export default function Toaster() {
  const { show, content, onClose } = useAppSelector(state => state.layout.toaster);

  const dispatch = useAppDispatch();

  const [toggle, setToggle] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setToggle(() => false);

      setTimeout(() => {
        onClose?.();
        dispatch(closeToaster());
      }, 300);
    }, 5 * 1000);

    return () => {
      clearTimeout(timer);
    };
  }, []);

  return (
    <>
      <TransitionGroup
        component={"div"}
        className={styles.toastr}
      >
        {show ? (
          <CSSTransition
            timeout={300}
            classNames={{
              appear: styles.toastr__appear,
              appearActive: styles.toastr__activeAppear,
              appearDone: styles.toastr__doneAppear,
              enter: styles.toastr__enter,
              enterActive: styles.toastr__activeEnter,
              enterDone: styles.toastr__doneEnter,
              exit: styles.toastr__exit,
              exitActive: styles.toastr__activeExit,
              exitDone: styles.toastr__doneExit,
            }}
          >
            <div className={classNames(styles.toastr__container, toggle ? styles.toastr__active : null)}>
              <p className={styles.toastr__text}>{content}</p>
            </div>
          </CSSTransition>
        ) : null}
      </TransitionGroup>
    </>
  );
}
