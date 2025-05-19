/* eslint-disable no-magic-numbers */
import { useEffect, useState } from "react";

import { useAppDispatch, useAppSelector } from "@store/hooks";
import { closeToaster } from "@store/slices/layout";
import classNames from "classnames";

import styles from "./Toaster.module.scss";

/** Контенер для рендера списка тостеров */
export default function Toaster() {
  const { show, content, status = "error", onClose } = useAppSelector(state => state.layout.toaster);

  const dispatch = useAppDispatch();

  const [isVisible, setIsVisible] = useState(false);
  const [toggle, setToggle] = useState(true);

  useEffect(() => {
    if (show) {
      setIsVisible(true);

      const timer = setTimeout(() => {
        setToggle(false);

        setTimeout(() => {
          onClose?.();
          dispatch(closeToaster());
        }, 300);
      }, 5000);

      return () => {
        clearTimeout(timer);
      };
    }

    setIsVisible(false);
  }, [show, onClose, dispatch]);

  return (
    <div className={styles.toastr}>
      {isVisible && (
        <div className={classNames(styles.toastr__container, styles[status], toggle ? styles.toastr__active : null)}>
          <p className={styles.toastr__text}>{content}</p>
        </div>
      )}
    </div>
  );
}
