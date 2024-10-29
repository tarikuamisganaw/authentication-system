import { createBrowserRouter, Navigate } from "react-router-dom";
import PrivateRoute from "../components/Guards/PrivateGuard";
import PublicRoute from "../components/Guards/PublicGuard";
import Profile from "../components/Profile";
import AppLayout from "../pages/AppLayout";
import Login from "../pages/LoginForm";
import Lost from "../pages/Lost";
import Signup from "../pages/SignupForm";
import ForgotPass from "../pages/ForgotPassForm";
import ResetPass from "../pages/ResetPassForm";

const router = createBrowserRouter([
  {
    path: "",
    element: <AppLayout />,
    children: [
      {
        path: "/",
        element: <Navigate to="/login" />, 
      },
      {
        path: "/",
        element: <PublicRoute />,
        children: [
          { path: "/login", element: <Login /> },
          { path: "/signup", element: <Signup /> },
          { path: "/recoverpass", element: <ForgotPass /> },
          { path: "/change-pass/:resetToken", element: <ResetPass /> },
        ],
      },
      {
        path: "/dash",
        element: <PrivateRoute />,
        children: [
          { path: "", element: <Profile /> }, // Default child route
        ],
      },
      { path: "404", element: <Lost /> },
      {
        path: "*",
        element: <Navigate to="/404" />,
      },
    ],
  },
]);

export { router };
