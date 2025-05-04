import React from "react";

import type { TDesignUserElementProps } from "../Design.types";

import styles from "./DesignUserElement.module.scss";

const DesignUserElement: React.FC<TDesignUserElementProps> = ({ siteElementBg }) => {
  return (
    <div
      className={styles.userElement}
      style={{ backgroundColor: siteElementBg }}
    >
      Элемент на сайте
    </div>
  );
};

export default DesignUserElement;
