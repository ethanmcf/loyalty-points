import { createContext, useContext, useState } from "react";

const UserContext = createContext();

/**
 * This provider contains information about the current user logged in.
 *
 * The Current user
 */
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null); // this is null when nobody is logged in

  return (
    <UserContext.Provider value={{ user }}>{children}</UserContext.Provider>
  );
};

export const useUser = () => {
  return useContext(UserContext);
};
