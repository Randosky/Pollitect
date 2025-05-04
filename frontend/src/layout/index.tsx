import { StrictMode, useEffect, useRef, useState } from "react";

import { store } from "@store/store";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

import styles from "./Layout.module.scss";

import AppRouter from "../router/routes";

import LayoutContainer from "./Container";
import ErrorBoundary from "./ErrorBoundary";
import LayoutFooter from "./Footer";
import LayoutHeader from "./Header";
import Loader from "./Loader";
import Modal from "./Modal";
import LayoutProvider from "./Provider/LayoutContext";
import LayoutFooterProvider from "./Provider/LayoutFooter";
import Toaster from "./Toaster";
import LayoutWrapper from "./Wrapper";

/** Лейаут для проекта в кабинете */
const Layout = () => {
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  const [loading, setLoading] = useState(true);

  const queryClient = new QueryClient();

  useEffect(() => {
    const html = document.documentElement;

    html.setAttribute("translate", "no");

    setLoading(false);
  }, []);

  if (loading) {
    return <main className={styles.main}>Загрузка</main>;
  }

  return (
    <StrictMode>
      <BrowserRouter>
        <QueryClientProvider client={queryClient}>
          <Provider store={store}>
            <LayoutProvider>
              <LayoutFooterProvider>
                <ErrorBoundary>
                  <LayoutWrapper ref={wrapperRef}>
                    <LayoutHeader />

                    <LayoutContainer>
                      <AppRouter />

                      <Modal />
                      <Toaster />
                      <Loader />
                    </LayoutContainer>

                    <LayoutFooter wrapperRef={wrapperRef} />
                  </LayoutWrapper>
                </ErrorBoundary>
              </LayoutFooterProvider>
            </LayoutProvider>
          </Provider>
        </QueryClientProvider>
      </BrowserRouter>
    </StrictMode>
  );
};

export default Layout;
