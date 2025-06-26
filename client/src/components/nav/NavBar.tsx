import { NavLink } from "react-router";
import CarRental from "../../assets/car-rental.png";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";

const NavBar = () => {
  const currentUser = useSelector((state: RootState) => state.user);

  return (
    <div className="navbar  shadow-sm bg:linear-gradient-to-r from-rose-300 via-white to-blue-600">
      <div className="navbar-start bg:linear-gradient-to-r from-rose-300 via-white to-blue-600">
        <div className="dropdown">
          <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {" "}
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h8m-8 6h16"
              />{" "}
            </svg>
          </div>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content  rounded-box z-1 mt-3 w-52 p-2 shadow bg-gray-600 text-white h-[200px] gap-2"
          >
            <li>
              <NavLink to={"/"}>Home</NavLink>
            </li>
            <li>
              <NavLink to={"/about"}>About</NavLink>
            </li>
            <li>
              <NavLink to={"/dashboard"}>Dashboard</NavLink>
            </li>
            <li>
              <NavLink to={"/register"}>Register</NavLink>
            </li>
            <li>
              <NavLink to={"/login"}>Login</NavLink>
            </li>
            <li>
              <a>Contact</a>
            </li>
          </ul>
        </div>
        <NavLink to={"/"}>
          <img
            src={CarRental}
            alt="car-rental"
            className="size-16 cursor-pointer"
          />
        </NavLink>
      </div>

      {/* Desktop mode */}
      <div className="navbar-center hidden lg:flex bg-linear-gradient-to-r from-rose-300 via-white to-blue-600">
        <ul className="menu menu-horizontal px-1">
          <li>
            <NavLink to={"/"}>Home</NavLink>
          </li>
          <li>
            <NavLink to={"/about"}>About</NavLink>
          </li>
          <li>
            <NavLink to={"/admin/dashboard/cars"}>Dashboard</NavLink>
          </li>
        </ul>
      </div>
      <div className="navbar-end flex gap-4 rounded-md">
        <li className="btn">
          <NavLink to={"/register"}>Register</NavLink>
        </li>
        <li className="btn">
          <NavLink to={"/login"}>Login</NavLink>
        </li>
        <button
          // onClick={""}
          className="bg-gray-300 text-white rounded-full p-2 hover:text-white hover:bg-blue-500 transition-all duration-150 ease-in-out cursor-pointer"
        >
          {currentUser?.user
            ? `${currentUser.user.first_name.charAt(
                0
              )}${currentUser.user.last_name.charAt(0)}`
            : ""}
        </button>
      </div>
    </div>
  );
};

export default NavBar;
