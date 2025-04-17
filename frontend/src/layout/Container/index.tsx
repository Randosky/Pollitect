import React, { PropsWithChildren } from "react";

import styles from "../Layout.module.scss";

const LayoutContainer: React.FC<PropsWithChildren> = ({ children }) => {
  return <main className={styles.mainContainer}>{children}</main>;
};

export default LayoutContainer;
