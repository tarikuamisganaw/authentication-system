import { createContext } from "react";

import store from "../redux/store";
import { authStorage } from "../utils/browserStorage";

export const AuthenticationContext = createContext({
  userIsAuthenticated: false,
});
