import { createContext, useContext, useState } from "react";

const UserContext = createContext();

/**
 * This provider contains information about the current user logged in.
 *
 * The Current user
 */
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // this is null when nobody is logged in

  const login = (user) => {
    setUser(user)
  }

  const logout = () => {
      setUser(null);
  }

  // Should only be called after login has been called
  // Overwrites passed in data to user
  // Assumes user is not null
  // data is a map of new data ie {password: newPassowrd, etc}
  const updateUser = (data) => {
    setUser(prev => ({
      ...prev,
      ...data
    }));
  };

  return (
    <UserContext.Provider value={{ user, login, logout }}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
