import { StrictMode, useEffect, useRef, useState } from "react";

import { store } from "@store/store";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import styles from "./Layout.module.scss";

import AppRouter from "../router/routes";

import LayoutContainer from "./Container";
import ErrorBoundary from "./ErrorBoundary";
import LayoutFooter from "./Footer";
import LayoutHeader from "./Header";
import Modal from "./Modal";
import LayoutProvider from "./Provider/LayoutContext";
import LayoutFooterProvider from "./Provider/LayoutFooter";
import Toaster from "./Toaster";

/** Лейаут для проекта в кабинете */
const Layout = () => {
  const headerRef = useRef<HTMLElement | null>(null);
  const footerRef = useRef<HTMLElement | null>(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const html = document.documentElement;

    html.setAttribute("translate", "no");

    if (headerRef.current) {
      const headerHeight = headerRef.current.offsetHeight;

      html.style.setProperty("--header-height", `${headerHeight}px`);
    }

    if (footerRef.current) {
      const footerHeight = footerRef.current.offsetHeight;

      html.style.setProperty("--footer-height", `${footerHeight}px`);
    }

    setLoading(false);
  }, []);

  if (loading) {
    return <main className={styles.main}>Загрузка</main>;
  }

  return (
    <StrictMode>
      <BrowserRouter>
        <Provider store={store}>
          <LayoutProvider>
            <LayoutFooterProvider>
              <ErrorBoundary>
                <div className={styles.wrapper}>
                  <LayoutHeader ref={headerRef} />

                  <LayoutContainer>
                    <AppRouter />

                    <Modal />
                    <Toaster />
                  </LayoutContainer>

                  <LayoutFooter ref={footerRef} />
                </div>
              </ErrorBoundary>
            </LayoutFooterProvider>
          </LayoutProvider>
        </Provider>
      </BrowserRouter>
    </StrictMode>
  );
};

export default Layout;
