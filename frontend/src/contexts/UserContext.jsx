import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginApi } from "../apis/AuthApi";
import { getMyInfo } from "../apis/UsersApi";

const UserContext = createContext();

/**
 * This provider contains information about the current user logged in.
 *
 * The Current user
 */
export const UserProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // this is null when nobody is logged in

  // Fetches logged in user info
  const fetchLoggedinInfo = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    const userData = await getMyInfo(token);
    setUser(userData);
  };

  // Fetches user info on reloads so login session not lost
  useEffect(() => {
    fetchLoggedinInfo();
  }, []);

  const login = async (email, password) => {
    const { token, _ } = await loginApi(email, password);
    localStorage.setItem("token", token);
    await fetchLoggedinInfo();
    navigate("/profile");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    navigate("/");
  };

  // Should only be called after login has been called
  // Overwrites passed in data to user
  // Assumes user is not null
  // data is a map of new data ie {password: newPassowrd, etc}
  const updateUser = (data) => {
    setUser((prev) => ({
      ...prev,
      ...data,
    }));
  };

  return (
    <UserContext.Provider value={{ user, login, logout, updateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
