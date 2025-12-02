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
  const [interfaceType, setInterfaceType] = useState(null);
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
        setUser(userData);
        setInterfaceType(userData.role);
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (email, password) => {
    const { token, _ } = await loginApi(email, password);
    localStorage.setItem("token", token);
    const userData = await fetchLoggedinInfo();
    return userData;
  };

  const completeLogin = (userData) => {
    setUser(userData);
    setInterfaceType(userData.role);
  };

  const logout = () => {
    setUser(null);
    setInterfaceType(null);
    localStorage.removeItem("token");
    localStorage.clear(); // for clearing filters
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
    }));
  };

  const updateInterfaceType = (type) => {
    setInterfaceType(type);
  };

  return (
    <UserContext.Provider
      value={{
        user,
        interfaceType,
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
