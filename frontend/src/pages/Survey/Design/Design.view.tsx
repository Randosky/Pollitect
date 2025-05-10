import React from "react";

import Fieldset from "@ui/Fieldset";
import classNames from "classnames";

import DesignPreview from "./DesignPreview";

import type { TDesignViewProps } from "./Design.types";

import pageStyles from "../Survey.module.scss";
import styles from "./Design.module.scss";

import DesignSettings from "./DesignSettings";
import DesignUserElement from "./DesignUserElement";

const DesignView: React.FC<TDesignViewProps> = ({
  settings,
  siteBg,
  siteElementBg,
  onChange,
  setSiteBg,
  setSiteElementBg,
}) => (
  <div className={classNames(pageStyles.page, styles.page)}>
    <h1 className={pageStyles.title}>Настройки дизайна</h1>

    <div className={classNames(pageStyles.container, styles.container)}>
      <Fieldset
        legend="Настройки"
        className={styles.sidebar}
      >
        <DesignSettings
          settings={settings}
          siteBg={siteBg}
          siteElementBg={siteElementBg}
          onChange={onChange}
          setSiteBg={setSiteBg}
          setSiteElementBg={setSiteElementBg}
        />
      </Fieldset>

      <Fieldset
        legend={"Страница на сайте"}
        containerProps={{ style: { backgroundColor: siteBg } }}
        className={classNames(styles.previewArea, styles[settings.placement])}
      >
        {settings.placement !== "inbuilt" && <DesignUserElement siteElementBg={siteElementBg} />}

        <DesignPreview settings={settings} />
      </Fieldset>
    </div>
  </div>
);

export default DesignView;
