import { Outlet } from "react-router";
import NavBar from "../../components/nav/NavBar";
import Footer from "../../components/footer/Footer";
import AdminDrawer from "./Aside/AdminDrawer";
import { FaBars } from "react-icons/fa";
import { LuX } from "react-icons/lu";
import { useState } from "react";

const AdminDashboard = () => {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const handleDrawerToggle = () => {
    setDrawerOpen((prev) => !prev);
  };

  return (
    <div>
      <NavBar />
      <div className="flex items-center bg-gray-700 p-4">
        <button
          onClick={handleDrawerToggle}
          className="mr-4 text-white text-2xl lg:hidden cursor-pointer "
        >
          {drawerOpen ? <LuX /> : <FaBars />}
        </button>

        <span className="text-white text-lg font-semibold">
          Welcome to Admin Dashboard
        </span>
      </div>
      <div className="flex">
        <aside
          className={`bg-gray-600 w-64 min-h-screen fixed top-0 
            ${drawerOpen ? "" : "hidden"}
            lg:static lg:block
          `}
        >
          <div>
            <button
              className="absolute top-4 right-4 text-white text-2xl cursor-pointer"
              onClick={handleDrawerToggle}
            >
              <LuX />
            </button>

            <AdminDrawer />
          </div>
        </aside>
        <main className="bg-emerald-500 w-full min-h-screen">
          <Outlet />
        </main>
      </div>
      <Footer />
    </div>
  );
};

export default AdminDashboard;
