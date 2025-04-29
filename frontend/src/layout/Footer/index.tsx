// src/layout/Footer/LayoutFooter.tsx
import React, { useCallback, useEffect, useState } from "react";

import { useLayoutFooter } from "@layout/Provider/LayoutFooter";

import styles from "./Footer.module.scss";

export type TLayoutFooterProps = {
  ref: React.RefObject<HTMLElement | null>;
  wrapperRef: React.RefObject<HTMLDivElement | null>;
};

/**
 * Фиксированный футер с тенью, появляющейся при прокрутке страницы вверх.
 *
 * Если пользователь не в самом низу страницы — отображается тень сверху футера,
 * иначе — тень скрывается.
 *
 * @param props.ref — ref для корневого <footer>
 */
const LayoutFooter: React.FC<TLayoutFooterProps> = ({ ref: footerRef, wrapperRef }) => {
  const { showFooter, footerContent } = useLayoutFooter();

  const [hasShadow, setHasShadow] = useState<boolean>(false);

  /** Функция обработчик прокрутки
   * @returns {void}
   */
  const handleScroll = useCallback((): void => {
    if (!wrapperRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = wrapperRef.current;

    const isScrollable = scrollHeight > clientHeight;
    const isScrolledNotBottom = Math.ceil(scrollTop + clientHeight) < scrollHeight;

    setHasShadow(isScrollable && isScrolledNotBottom);
  }, []);

  /** Обработчик прокрутки: показываем тень, если не доскроллено до низа */
  useEffect(() => {
    handleScroll();

    wrapperRef.current?.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      wrapperRef.current?.removeEventListener("scroll", handleScroll);
    };
  }, []);

  if (!showFooter) {
    return null;
  }

  return (
    <footer
      ref={footerRef}
      className={`${styles.footer} ${hasShadow ? styles.shadow : ""}`}
    >
      {footerContent}
    </footer>
  );
};

export default LayoutFooter;
