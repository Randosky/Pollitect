import React, { PropsWithChildren } from "react";

import { useLayoutFooter } from "@layout/Provider/LayoutFooter";
import classNames from "classnames";

import styles from "../Layout.module.scss";

const LayoutContainer: React.FC<PropsWithChildren> = ({ children }) => {
  const { showFooter } = useLayoutFooter();

  return (
    <main className={classNames(styles.mainContainer, showFooter && styles.mainContainer__withFooter)}>{children}</main>
  );
};

export default LayoutContainer;
