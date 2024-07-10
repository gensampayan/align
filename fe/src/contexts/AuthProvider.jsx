import AuthContext from "./AuthContext";
import { useState, useEffect } from "react";

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("user") ? true : false
  );

  const [user, setUser] = useState(
    localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : {}
  );
  useEffect(() => {
    if (isLoggedIn) {
      setUser(JSON.parse(localStorage.getItem("user")));
    } else {
      setUser({});
    }
  }, [isLoggedIn]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        setIsLoggedIn,
        user,
        setUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
