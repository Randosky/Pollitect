import { ReactElement } from "react";

import useAuth from "@hooks/useAuth";
import Dashboard from "@pages/Dashboard";
import HomePage from "@pages/Home";
import Login from "@pages/Login";
import Quiz from "@pages/Quiz";
import Constructor from "@pages/Quiz/Constructor";
import Design from "@pages/Quiz/Design";
import Settings from "@pages/Quiz/Settings";
import Registration from "@pages/Registration";
import { BrowserRouter, Navigate, Outlet, Route, Routes } from "react-router-dom";

/**
 * Компонент UnAuthorizedRoute, который защищает доступ
 * к определенным страницам, если не получилось получить данные пользовать.
 * Если получилось получить данные пользовать, то происходит редирект
 * на главную страницу.
 *
 * @returns {ReactElement} - компонент Navigate или Outlet
 */
const UnAuthorizedRoute = (): ReactElement => {
  const isAuthenticated = false;

  if (isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

/**
 * Компонент PrivateRoute, который защищает доступ
 * к определенным страницам, если пользователь не авторизован.
 *
 * @returns {ReactElement} - компонент Navigate или Outlet
 */

const PrivateRoute = (): ReactElement => {
  const isAuthenticated = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

/**
 * Компонент AdminRoute, который защищает доступ
 * к определенным страницам, если пользователь не
 * имеет права администратора.
 *
 * @returns {ReactElement} - компонент Navigate или Outlet
 */
const AdminRoute = (): ReactElement => {
  const isAdmin = true;
  const isAuthenticated = useAuth();

  if (!isAuthenticated || !isAdmin) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
};

// Компоненты страниц
const About = () => <h2>About</h2>;
const AdminDashboard = () => <h2>Admin Dashboard</h2>;
const NotFound = () => <h2>Not found</h2>;

/**
 * Компонент AppRouter, который содержит все маршруты приложения.
 * Маршруты делятся на открытые (доступные всем) и приватные (доступные только
 * авторизованным пользователям).
 *
 * @returns {ReactElement} - компонент BrowserRouter со всеми маршрутами
 */
const AppRouter = (): ReactElement => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Открытые страницы */}
        <Route
          path="/"
          element={<HomePage />}
        />

        <Route
          path="about"
          element={<About />}
        />

        {/* Страница 404 */}
        <Route
          path="*"
          element={<NotFound />}
        />

        {/* Маршруты для неавторизованных пользователей */}
        <Route element={<UnAuthorizedRoute />}>
          <Route
            path="login"
            element={<Login />}
          />

          <Route
            path="registration"
            element={<Registration />}
          />
        </Route>

        {/* Приватные маршруты с проверкой аутентификации */}
        <Route element={<PrivateRoute />}>
          <Route
            path="dashboard"
            element={<Dashboard />}
          />

          <Route
            path="quiz"
            element={<Quiz />}
          >
            {/* Если просто зашли на /quiz без саб-роутов */}
            <Route
              index
              element={
                <Navigate
                  to="/dashboard"
                  replace
                />
              }
            />

            <Route
              path="edit/:quizId"
              element={<Constructor />}
            />

            <Route
              path="design/:quizId"
              element={<Design />}
            />

            <Route
              path="settings/:quizId"
              element={<Settings />}
            />
          </Route>
        </Route>

        {/* Приватные маршруты для администратора */}
        <Route element={<AdminRoute />}>
          <Route
            path="admin"
            element={<AdminDashboard />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default AppRouter;
