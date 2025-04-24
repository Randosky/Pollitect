import React from "react";

import { useLayoutFooter } from "@layout/Provider/LayoutFooter";

import styles from "./Footer.module.scss";

export type TLayoutFooterProps = {
  ref: React.RefObject<HTMLElement | null>;
};

const LayoutFooter: React.FC<TLayoutFooterProps> = ({ ref }) => {
  const { showFooter, footerContent } = useLayoutFooter();

  if (!showFooter) return;

  return (
    <footer
      ref={ref}
      className={styles.footer}
    >
      {footerContent}
    </footer>
  );
};

export default LayoutFooter;
