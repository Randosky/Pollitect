import React from "react";

import { useLayout } from "@layout/Provider/LayoutContext";

import styles from "./Header.module.scss";

export type TLayoutHeaderProps = {
  ref: React.RefObject<HTMLElement | null>;
};

const LayoutHeader: React.FC<TLayoutHeaderProps> = ({ ref }) => {
  const { showHeader, headerContent } = useLayout();

  if (!showHeader) return;

  return (
    <header
      ref={ref}
      className={styles.header}
    >
      {headerContent}
    </header>
  );
};

export default LayoutHeader;
