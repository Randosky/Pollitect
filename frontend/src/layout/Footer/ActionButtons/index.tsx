import React from "react";

import styles from "./ActionButtons.module.scss";

export type TActionButtons = {
  handleSave: () => void;
  handleCancel: () => void;
};

const ActionButtons: React.FC<TActionButtons> = ({ handleSave, handleCancel }) => {
  return (
    <section className={styles.actionButtons}>
      <button
        type="button"
        className={styles.cancel}
        onClick={handleCancel}
      >
        Отменить
      </button>

      <button
        type="button"
        className={styles.save}
        onClick={handleSave}
      >
        Сохранить
      </button>
    </section>
  );
};

export default ActionButtons;
