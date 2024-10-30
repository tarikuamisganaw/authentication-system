import { createContext } from "react";


export const AuthenticationContext = createContext({
  userIsAuthenticated: false,
});
