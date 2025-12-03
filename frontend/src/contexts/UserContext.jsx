import { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { generateMaskToken, login as loginApi } from "../apis/AuthApi";
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
  const [loading, setLoading] = useState(true);

  // Fetches logged in user info
  const fetchLoggedinInfo = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }
    const userData = await getMyInfo(token);
    return userData;
  };

  // Fetches user info on reloads so login session not lost
  useEffect(() => {
    const loadUser = async () => {
      setLoading(true);
      const userData = await fetchLoggedinInfo();
      if (userData) {
        setUser({ ...userData, role: localStorage.getItem("role") });
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    const { token, _ } = await loginApi(email, password);
    localStorage.setItem("token", token);
    localStorage.setItem("originalToken", token);
    const userData = await fetchLoggedinInfo();
    return userData;
  };

  const completeLogin = (userData) => {
    setUser(userData);
    localStorage.setItem("role", userData.role);
    localStorage.setItem("originalRole", userData.role);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("originalToken");
    localStorage.removeItem("originalRole");
    localStorage.removeItem("role");

    navigate("/");
  };

  // Should only be called after login has been called
  // Overwrites passed in data to user
  // Assumes user is not null
  // data is a map of new data ie {password: newPassowrd, etc}
  const updateUser = async (data) => {
    setUser((prev) => ({
      ...prev,
      ...data,
      role: localStorage.getItem("role"),
    }));
  };

  const updateInterfaceType = async (type) => {
    let token = localStorage.getItem("originalToken");
    if (type !== localStorage.getItem("originalRole")) {
      token = await generateMaskToken(
        localStorage.getItem("originalToken"),
        type
      );
    }
    localStorage.setItem("token", token);
    localStorage.setItem("role", type);
    setUser((prev) => ({
      ...prev,
      role: type,
    }));
  };

  return (
    <UserContext.Provider
      value={{
        user,
        loading,
        completeLogin,
        login,
        logout,
        updateUser,
        updateInterfaceType,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
