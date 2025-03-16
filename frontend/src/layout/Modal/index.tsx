import { type FC, type KeyboardEvent, useEffect } from "react";

import { useAppDispatch, useAppSelector } from "@store/hooks";
import { closeModal } from "@store/slices/layout";

import styles from "./Modal.module.scss";

/** Модальное окно */
const Modal: FC = () => {
  const dispatch = useAppDispatch();
  const { show, content, onClose } = useAppSelector(state => state.layout.modal);

  /** Закрытие модального окна */
  const handleClickCloseModal = () => {
    onClose?.();

    dispatch(closeModal());
  };

  /** Запрет скролла при открытом модальном окне */
  useEffect(() => {
    if (show) document.body.classList.add("no-scroll");
    else document.body.classList.remove("no-scroll");
  }, [show]);

  /** Обработка нажатися на ESC */
  function handleKeyPressCloseModal(event: KeyboardEvent<HTMLDivElement>) {
    if (event.code !== "Escape") return;

    onClose?.();

    dispatch(closeModal());
  }

  return (
    <div
      role="presentation"
      onKeyDown={handleKeyPressCloseModal}
      className={[styles.modal, show ? styles.modal__open : null].join(" ")}
    >
      <div className={styles.modal__wrapper}>
        <div className={styles.modal__container}>{content || null}</div>
      </div>

      <div
        role="presentation"
        className={styles.modal__bg}
        onClick={handleClickCloseModal}
        onKeyDown={handleKeyPressCloseModal}
      />
    </div>
  );
};

export default Modal;
