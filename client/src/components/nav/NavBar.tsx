import { NavLink } from "react-router";
import CarRental from "../../assets/car-rental.png";

const NavBar = () => {
  return (
    <div className="navbar bg-base-100 shadow-sm">
      <div className="navbar-start">
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
              <a>Home</a>
            </li>
            <li>
              <a>About</a>
              <ul className="p-2">
                <li>
                  <a></a>
                </li>
                <li>
                  <a>Submenu 2</a>
                </li>
              </ul>
            </li>
            <li>
              <a href="">Register</a>
            </li>
            <li>
              <a href="">Login</a>
            </li>
            <li>
              <a>Contact</a>
            </li>
          </ul>
        </div>
        <img src={CarRental} alt="car-rental" className="size-16" />
      </div>

      {/* Desktop mode */}
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <a>Home</a>
          </li>
          <li>
            <NavLink to={"/about"}>About</NavLink>
            {/* <details>
              <summary>About</summary>
              <ul className="p-2">
                <li>
                  <a>Submenu 1</a>
                </li>
                <li>
                  <a>Submenu 2</a>
                </li>
              </ul>
            </details> */}
          </li>
          <li>
            <a>Dashboard</a>
          </li>
        </ul>
      </div>
      <div className="navbar-end flex gap-4 rounded-md">
        <a href="" className="btn">
          Login
        </a>
        <a className="btn">Register</a>
        <a href="" className="btn btn-ghost">
          Profile
        </a>
      </div>
    </div>
  );
};

export default NavBar;
