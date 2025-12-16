import { lazy, Suspense } from "react";
import DashboardLayout from "./layouts/DashboardLayout";
import NotFound from "./components/NotFound";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Team from "./pages/Team";
import RegisterPage from "./pages/RegisterPage";
import Loginpage from "./pages/Loginpage";
import ProtectedRoute from "./routes/protectedRoute";
import PublicRoutes from "./routes/PublicRoutes";
import Profilepage from "./pages/Profilepage";
import Dashboard from "./pages/Dashboard";
import { ToastContainer } from "react-toastify";
import OrderData from "./pages/OrderData";
import ForgotPassword from "./pages/ForgotPasswordPage";
import PasswordReset from "./pages/PasswordReset";
import UserPreview from "./components/UserPreview";
import Task from "./pages/Task/Task";
import TaskManager from "./pages/Task/TaskManager";
import Loading from "./common-components/Loading";

const User = lazy(() => import("./pages/User"));

const App = () => {
  return (
    <>
      <ToastContainer autoClose={800} />
      <BrowserRouter>
        <Routes>
          <Route
            path="/register"
            element={
              <PublicRoutes>
                <RegisterPage />
              </PublicRoutes>
            }
          />
          <Route
            path="/login"
            element={
              <PublicRoutes>
                <Loginpage />
              </PublicRoutes>
            }
          />
          <Route
            path="/forgotPassword"
            element={
              <PublicRoutes>
                <ForgotPassword />
              </PublicRoutes>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="team" element={<Team />} />
            <Route
              path="user"
              element={
                <Suspense fallback={<Loading />}>
                  <User />
                </Suspense>
              }
            />
            <Route path="order" element={<OrderData />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="reset-password" element={<PasswordReset />} />
            <Route path="/profile" element={<Profilepage />} />
            <Route path="/preview" element={<UserPreview />} />
            <Route path="/tasks" element={<Task />} />
            <Route path="/task-manager" element={<TaskManager />} />
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
};

export default App;
