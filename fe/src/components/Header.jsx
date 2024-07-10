import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../assets/images/align-logo.png";
import { IoIosSearch } from "react-icons/io";
import { useContext } from "react";
import AuthContext from "../contexts/AuthContext";

const Header = () => {
  const { user, isLoggedIn, setIsLoggedIn } = useContext(AuthContext);
  const navigate = useNavigate();

  const signOut = () => {
    localStorage.clear();
    setIsLoggedIn(false);
    navigate("/");
  };
  return (
    <header className="flex relative">
      <div className="flex mt-5 w-1/2">
        <div>
          <Link className="app-logo" to="/">
            <img src={logo} alt="align-logo" className="w-fit h-10" />
          </Link>
        </div>
        {/* hide
        <div className="flex">
          <input
            type="text"
            placeholder="Enter an name, city"
            className="border border-solid border-black w-96 h-10"
          />
          <IoIosSearch className="border border-solid border-black w-12 h-10 bg-customOrange rounded-tr-md rounded-br-md cursor-pointer" />
        </div>
        */}
      </div>
      <div className="flex mt-5 w-1/2 justify-center gap-2">
        <nav>
          {isLoggedIn ? (
            <>
              <button className="bg-customOrange font-bold p-3 ml-10 w-40 text-white">
                <NavLink className="your-events-btn" to="/your-events">
                  Own Events
                </NavLink>
              </button>
              <button className="bg-customOrange font-bold p-3 ml-10 h-12 w-24 rounded-full text-white">
                <NavLink className="member-btn" to="/members">
                  {user.name}
                </NavLink>
              </button>{" "}
              <button
                onClick={signOut}
                className="bg-customOrange font-bold p-3 ml-10 h-12 w-24 rounded-full text-white"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <button className="bg-customOrange font-bold p-3 ml-10 w-40 text-white">
                <NavLink className="login-btn" to="/login">
                  Login
                </NavLink>
              </button>
              <button className="bg-customOrange font-bold p-3 ml-10 w-40 text-white">
                <NavLink className="register-btn" to="/register">
                  Sign up
                </NavLink>
              </button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
