import React, { useEffect, useRef } from "react";

import { useLayout } from "@layout/Provider/LayoutContext";

import styles from "./Header.module.scss";

const LayoutHeader: React.FC = () => {
  const headerRef = useRef<HTMLElement | null>(null);

  const { showHeader, headerContent } = useLayout();

  useEffect(() => {
    const html = document.documentElement;

    if (showHeader && html && headerRef.current) {
      const headerHeight = headerRef.current.offsetHeight;

      html.style.setProperty("--header-height", `${headerHeight}px`);
    } else {
      html.style.removeProperty("--header-height");
    }
  }, [showHeader]);

  if (!showHeader) return;

  return (
    <header
      ref={headerRef}
      className={styles.header}
    >
      {headerContent}
    </header>
  );
};

export default LayoutHeader;
