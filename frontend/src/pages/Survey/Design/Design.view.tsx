import React from "react";

import DesignPreview from "./DesignPreview";

import type { TDesignViewProps } from "./Design.types";

import styles from "./Design.module.scss";

import DesignSettings from "./DesignSettings";

const DesignView: React.FC<TDesignViewProps> = ({ settings, onChange }) => (
  <div className={styles.root}>
    <aside className={styles.sidebar}>
      <h2 className={styles.header}>Настройки дизайна</h2>

      <DesignSettings
        settings={settings}
        onChange={onChange}
      />
    </aside>

    <main className={styles.previewArea}>
      <DesignPreview settings={settings} />
    </main>
  </div>
);

export default DesignView;
