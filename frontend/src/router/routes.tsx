import { ReactElement } from "react";

import Dashboard from "@pages/Dashboard";
import Home from "@pages/Home";
import Login from "@pages/Login";
import Registration from "@pages/Registration";
import Survey from "@pages/Survey";
import Constructor from "@pages/Survey/Constructor";
import Design from "@pages/Survey/Design";
import Settings from "@pages/Survey/Settings";
import { useAppSelector } from "@store/hooks";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";

/**
 * Компонент UnAuthorizedRoute, который защищает доступ
 * к определенным страницам, если не получилось получить данные пользовать.
 * Если получилось получить данные пользовать, то происходит редирект
 * на главную страницу.
 *
 * @returns {ReactElement} - компонент Navigate или Outlet
 */
const UnAuthorizedRoute = (): ReactElement => {
  const { id } = useAppSelector(state => state.user);

  if (id !== -1) {
    return (
      <Navigate
        to={`/dashboard/${id}`}
        replace
      />
    );
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
  const { id } = useAppSelector(state => state.user);

  if (id === -1) {
    return (
      <Navigate
        to="/"
        replace
      />
    );
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
  const { id, role } = useAppSelector(state => state.user);

  if (id === -1 || role !== "admin") {
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
  const user = useAppSelector(state => state.user);

  return (
    <>
      <Routes>
        {/* Открытые страницы */}
        <Route
          path="/"
          element={<Home />}
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
          {/* Если просто зашли на /dashboard без саб-роутов */}
          <Route
            path="dashboard"
            element={
              <Navigate
                to={user.id < 0 ? "/" : `/dashboard/${user.id}`}
                replace
              />
            }
          />

          <Route
            path="dashboard/:userId"
            element={<Dashboard />}
          />

          <Route
            path="survey/:surveyId"
            element={<Survey />}
          >
            {/* Если просто зашли на /survey без саб-роутов */}
            <Route
              index
              element={
                <Navigate
                  to={user.id < 0 ? "/" : `/dashboard/${user.id}`}
                  replace
                />
              }
            />

            <Route
              path="edit"
              element={<Constructor />}
            />

            <Route
              path="design"
              element={<Design />}
            />

            <Route
              path="settings"
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
    </>
  );
};

export default AppRouter;
