import { useRef, useEffect, useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../contexts/AuthContext";
import axios from "axios";
import logo from "../assets/images/align-logo.png";

const SignIn = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [invalidLogin, setInvalidLogin] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { setIsLoggedIn, setUser } = useContext(AuthContext);

  const userCredentials = {
    email,
    password
  };
  // regex for email, ensures that the email address contains a local part, an '@' symbol, and a domain part separated by a dot. And no whitespace characters in email address
  let emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  // regex for password, at least 8 characters long.
  let passwordRegex = /^.{8,}$/;

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();

      setEmailError(
        email.match(emailRegex) !== null
          ? ""
          : "The email address should include a local part, followed by an '@' symbol, and then a domain part separated by a dot."
      );

      setPasswordError(
        password.match(passwordRegex) !== null
          ? ""
          : "Password should at least 8 characters long"
      );

      if (
        email.match(emailRegex) !== null &&
        password.match(passwordRegex) !== null
      ) {
        const {
          data: { data }
        } = await axios.post("http://localhost:8080/api/v1/users/login", {
          email,
          password
        });
        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        setInvalidLogin("");
        setError("");
        setIsLoggedIn(true);
        navigate("/home");
      } else {
        setInvalidLogin(
          "Email and password should meet the minimum requirements."
        );
        setError("");
      }
    } catch (error) {
      console.error(error.message);
      setError(error.message);
      setInvalidLogin(error.message);
    }
  };

  const inputRef = useRef(null);

  useEffect(() => {
    inputRef.current.focus();
  }, []);

  return (
    <div className="signup-container flex justify-center items-center mt-20">
      <img
        className="align-auto mt-8"
        src={logo}
        alt="align-logo"
      />
      <main className="signup-main">
        <form onSubmit={handleSubmit} className="">
          <div className="">
            <label className="signup-label" htmlFor="log-email">
              Email
            </label>
            <input
              className="signup-input"
              type="email"
              id="log-email"
              name="log-email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              ref={inputRef}
              required
            ></input>
            <div className="signup-input-error">{emailError}</div>
          </div>
          <div className="">
            <label className="signup-label" htmlFor="log-password">
              Password
            </label>
            <input
              className="signup-input"
              type="password"
              id="log-password"
              name="log-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            ></input>
            <div className="signup-input-error">{passwordError}</div>
          </div>
          <div className="m-10 text-center">
            <p className="text-lg">
              Not a member yet?{" "}
              <Link to="/register" className="text-primary">
                Sign up
              </Link>
            </p>
          </div>
          <div className="signup-button-container mb-8">
            <input
              className="signup-button"
              type="submit"
              value="Submit"
            ></input>
            {invalidLogin && (
              <div className="signup-submit-error text-center">
                {invalidLogin}
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

export default SignIn;
