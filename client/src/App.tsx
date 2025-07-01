import { Toaster } from "react-hot-toast";
import { createBrowserRouter, RouterProvider } from "react-router";
import Login from "./auth/login";
import Register from "./auth/register";
import VerifyUser from "./auth/verifyUser";
import AdminDashboard from "./dashboard/AdminDashboard.tsx/AdminDashboard";
import AboutPage from "./pages/AboutPage";
import LandingPage from "./pages/LandingPage";
import Cars from "./dashboard/AdminDashboard.tsx/cars/cars";
import Users from "./dashboard/manageUsers/Users";
import Profile from "./dashboard/AdminDashboard.tsx/Profile";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/about",
    element: <AboutPage />,
  },
  {
    path: "/register/verify",
    element: <VerifyUser />,
  },
  {
    path: "/admin/dashboard",
    element: <AdminDashboard />,
    children: [
      {
        path: "cars",
        element: <Cars />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
      {
        path: "analytics",
        element: <h1>Analytics</h1>,
      },
    ],
  },
]);
const App = () => {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster
        position="top-right"
        reverseOrder={false}
        gutter={8}
        containerClassName=""
        containerStyle={{}}
        toastOptions={{
          // Define default options
          className: "",
          duration: 5000,
          removeDelay: 1000,
          style: {
            background: "#363636",
            color: "#fff",
          },

          // Default options for specific types
          success: {
            duration: 3000,
            iconTheme: {
              primary: "green",
              secondary: "black",
            },
          },
        }}
      />
    </>
  );
};

export default App;
