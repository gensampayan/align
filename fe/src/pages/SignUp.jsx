import { useEffect, useRef, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../contexts/AuthContext";
import logo from "../assets/images/align-logo.png";

const SignUp = () => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    location: "",
    email: "",
    password: ""
  });
  const [firstNameError, setFirstNameError] = useState("");
  const [lastNameError, setLastNameError] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [locationError, setLocationError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [invalidSignUp, setInvalidSignUp] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setIsLoggedIn } = useContext(AuthContext);

  // regex for name, allowed alphabet charactes, hypen, apostrophe, or period
  let nameRegex = /^[a-zA-Z0-9\s\-'.]+$/;

  // regex for location, allowed alphabet charactes, hypen, apostrophe, or period
  let locationRegex = /^[a-zA-Z0-9\s\-'.]+$/;

  // regex for email, ensures that the email address contains a local part, an '@' symbol, and a domain part separated by a dot. And no whitespace characters in email address
  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // regex for password, at least 8 characters long.
  let passwordRegex = /^.{8,}$/;

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      setFirstNameError(
        user.firstName.match(nameRegex) !== null
          ? ""
          : "The name should consist of letters; numbers, hyphens, apostrophes, and periods are also acceptable."
      );

      setLastNameError(
        user.lastName.match(nameRegex) !== null
          ? ""
          : "The name should consist of letters; numbers, hyphens, apostrophes, and periods are also acceptable."
      );

      setLocationError(
        user.location.match(locationRegex) !== null
          ? ""
          : "The location should consist of letters; numbers, hyphens, apostrophes, and periods are also acceptable."
      );

      setEmailError(
        user.email.match(emailRegex) !== null
          ? ""
          : "The email address should include a local part, followed by an '@' symbol, and then a domain part separated by a dot."
      );

      setPasswordError(
        user.password.match(passwordRegex) !== null
          ? ""
          : "Password should at least 8 characters long"
      );

      setConfirmPasswordError(
        confirmPassword === user.password ? "" : "Not same with the password"
      );

      if (
        user.firstName.match(nameRegex) !== null &&
        user.lastName.match(nameRegex) !== null &&
        user.location.match(locationRegex) !== null &&
        user.email.match(emailRegex) !== null &&
        user.password.match(passwordRegex) !== null &&
        confirmPassword === user.password
      ) {
        await axios.post("http://localhost:8080/api/v1/users/register", {
          firstName: user.firstName,
          lastName: user.lastName,
          location: user.location,
          email: user.email,
          password: user.password
        });
        const {
          data: { data }
        } = await axios.post("http://localhost:8080/api/v1/users/login", {
          email: user.email,
          password: user.password
        });

        localStorage.setItem("user", JSON.stringify(data));
        setInvalidSignUp("");
        setError("");
        setIsLoggedIn(true);
        navigate("/home");
      } else {
        setInvalidSignUp(
          "All input fields should meet the minimum requirements."
        );
        setError("");
      }
    } catch (error) {
      console.error(error.message);
      setInvalidSignUp("");
      setError(error.response.data.message);
    }
  };
  return (
    <div className="signup-container">
      <img className="align-auto mt-8" src={logo} alt="align-logo" />
      <main className="signup-main">
        <form onSubmit={handleSubmit} className="">
          <div className="">
            <label className="signup-label" htmlFor="firstName">
              First Name
            </label>
            <input
              className="signup-input"
              type="text"
              id="firstName"
              name="firstName"
              value={user.firstName}
              onChange={(e) => setUser({ ...user, firstName: e.target.value })}
              ref={inputRef}
              required
            ></input>
            <div className="signup-input-error">{firstNameError}</div>
          </div>
          <div className="">
            <label className="signup-label" htmlFor="lastName">
              Last Name
            </label>
            <input
              className="signup-input"
              type="text"
              id="lastName"
              name="lastName"
              value={user.lastName}
              onChange={(e) => setUser({ ...user, lastName: e.target.value })}
              required
            ></input>
            <div className="signup-input-error">{lastNameError}</div>
          </div>
          <div className="">
            <label className="signup-label" htmlFor="location">
              Location
            </label>
            <input
              className="signup-input"
              type="text"
              id="location"
              name="location"
              value={user.location}
              onChange={(e) => setUser({ ...user, location: e.target.value })}
              required
            ></input>
            <div className="signup-input-error">{locationError}</div>
          </div>
          <div className="">
            <label className="signup-label" htmlFor="email">
              Email
            </label>
            <input
              className="signup-input"
              type="text"
              id="email"
              name="email"
              value={user.email}
              onChange={(e) => setUser({ ...user, email: e.target.value })}
              required
            ></input>
            <div className="signup-input-error">{emailError}</div>
          </div>
          <div className="">
            <label className="signup-label" htmlFor="password">
              Password
            </label>
            <input
              className="signup-input"
              type="password"
              id="password"
              name="password"
              value={user.password}
              onChange={(e) => setUser({ ...user, password: e.target.value })}
              required
            ></input>
            <div className="signup-input-error">{passwordError}</div>
          </div>
          <div className="">
            <label className="signup-label" htmlFor="confirm-password">
              Confirm Password
            </label>
            <input
              className="signup-input"
              type="password"
              id="confirm-password"
              name="confirm-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            ></input>
            <div className="signup-input-error">{confirmPasswordError}</div>
          </div>
          <div className="m-10 text-center">
            <p className="text-lg  ">
              Already a member?{" "}
              <Link to="/login" className="text-primary">
                Log in
              </Link>
            </p>
          </div>
          <div className="signup-button-container mb-8">
            <input
              className="signup-button"
              type="submit"
              value="Sign up"
            ></input>
            {invalidSignUp && (
              <div className="signup-submit-error text-center">
                {invalidSignUp}
              </div>
            )}
            {error && (
              <div className="signup-submit-error text-center">{error}</div>
            )}
          </div>
        </form>
      </main>
    </div>
  );
};
export default SignUp;
