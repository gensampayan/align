import { useEffect, useState, useContext, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AuthContext from "../contexts/AuthContext";

const ProfileEdit = () => {
  const [profileToEdit, setProfileToEdit] = useState({
    firstName: "",
    lastName: "",
    location: "",
    email: "",
    password: "",
    image: { path: "", filename: "" }
  });
  const [imageFile, setImageFile] = useState("");
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
  const {
    user: { accessToken },
    setUser,
    setIsLoggedIn
  } = useContext(AuthContext);

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

  useEffect(() => {
    (async () => {
      const {
        data: { data }
      } = await axios.get("http://localhost:8080/api/v1/users", {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setProfileToEdit(
        data || {
          firstName: "",
          lastName: "",
          location: "",
          email: "",
          password: "",
          image: { path: "", filename: "" }
        }
      );
    })();
  }, [accessToken]);

  const handleUpdate = async (e) => {
    try {
      e.preventDefault();

      setFirstNameError(
        profileToEdit.firstName &&
          profileToEdit.firstName.match(nameRegex) !== null
          ? ""
          : "The name should consist of letters; numbers, hyphens, apostrophes, and periods are also acceptable."
      );

      setLastNameError(
        profileToEdit.lastName &&
          profileToEdit.lastName.match(nameRegex) !== null
          ? ""
          : "The name should consist of letters; numbers, hyphens, apostrophes, and periods are also acceptable."
      );

      setLocationError(
        profileToEdit.location &&
          profileToEdit.location.match(locationRegex) !== null
          ? ""
          : "The location should consist of letters; numbers, hyphens, apostrophes, and periods are also acceptable."
      );

      setEmailError(
        profileToEdit.email && profileToEdit.email.match(emailRegex) !== null
          ? ""
          : "The email address should include a local part, followed by an '@' symbol, and then a domain part separated by a dot."
      );

      setPasswordError(
        profileToEdit.password &&
          profileToEdit.password.match(passwordRegex) !== null
          ? ""
          : "Password should at least 8 characters long"
      );

      setConfirmPasswordError(
        confirmPassword === profileToEdit.password
          ? ""
          : "Not same with the password"
      );

      if (
        profileToEdit.firstName.match(nameRegex) !== null &&
        profileToEdit.lastName.match(nameRegex) !== null &&
        profileToEdit.location.match(locationRegex) !== null &&
        profileToEdit.email.match(emailRegex) !== null &&
        profileToEdit.password.match(passwordRegex) !== null &&
        confirmPassword === profileToEdit.password
      ) {
        const profileDataEdited = new FormData();
        profileDataEdited.append("firstName", profileToEdit.firstName);
        profileDataEdited.append("lastName", profileToEdit.lastName);
        profileDataEdited.append("location", profileToEdit.location);
        profileDataEdited.append("email", profileToEdit.email);
        profileDataEdited.append("password", profileToEdit.password);
        if (imageFile) {
          profileDataEdited.append("user-image", imageFile);
        }
        const editedProfile = await axios.put(
          "http://localhost:8080/api/v1/users",
          profileDataEdited,
          {
            headers: { Authorization: `Bearer ${accessToken}` }
          }
        );
        localStorage.removeItem("user");
        const {
          data: { data }
        } = await axios.post("http://localhost:8080/api/v1/users/login", {
          email: profileToEdit.email,
          password: profileToEdit.password
        });

        localStorage.setItem("user", JSON.stringify(data));
        setUser(data);
        setInvalidSignUp("");
        setError("");
        setIsLoggedIn(true);
        // console.log(editedProfile);
        navigate("/members");
      } else {
        setInvalidSignUp(
          "Email and password should meet the minimum requirements."
        );
        setError("");
      }
    } catch (error) {
      console.error(error.message);
      setError(error.response.data.message);
      setInvalidSignUp(error.message);
    }
  };

  return (
    <>
      <div className="signup-container my-5">
        <main className="signup-main">
          <form onSubmit={handleUpdate} className="">
            <div className="">
              <label className="signup-label" htmlFor="firstName">
                First Name
              </label>
              <input
                className="signup-input"
                type="text"
                id="firstName"
                name="firstName"
                value={profileToEdit.firstName || ""}
                onChange={(e) =>
                  setProfileToEdit({
                    ...profileToEdit,
                    firstName: e.target.value
                  })
                }
                ref={inputRef}
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
                value={profileToEdit.lastName || ""}
                onChange={(e) =>
                  setProfileToEdit({
                    ...profileToEdit,
                    lastName: e.target.value
                  })
                }
              ></input>
              <div className="signup-input-error">{lastNameError}</div>
            </div>
            <div className="">
              <label className="signup-label" htmlFor="photo">
                Profile Picture
              </label>
              <input
                className="signup-input border-none"
                type="file"
                id="photo"
                name="photo"
                onChange={(e) => setImageFile(e.target.files[0])}
                required
              ></input>
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
                value={profileToEdit.location || ""}
                onChange={(e) =>
                  setProfileToEdit({
                    ...profileToEdit,
                    location: e.target.value
                  })
                }
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
                value={profileToEdit.email || ""}
                onChange={(e) =>
                  setProfileToEdit({ ...profileToEdit, email: e.target.value })
                }
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
                value={profileToEdit.password || ""}
                onChange={(e) =>
                  setProfileToEdit({
                    ...profileToEdit,
                    password: e.target.value
                  })
                }
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
            <div className="flex flex-row justify-around">
              <button className="signup-button" onClick={() => navigate(-1)}>
                Back
              </button>
              <button type="submit" className="signup-button">
                Save
              </button>
            </div>
            <div className="signup-button-container mb-8">
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
    </>
  );
};

export default ProfileEdit;
