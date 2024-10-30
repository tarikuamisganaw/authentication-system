import React, { useEffect, useState, useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import { getUserProfile, refreshAccessToken } from "../../../api";
import {
  addAuthToken,
  addAuthUser,
} from "../../../redux/features/auth/authSlice";
import { AuthenticationContext } from "../../../context/authenticationContext";

let cmpntInitialized = false;
let componentIsMounted = false;

const PrivateRouteGuard = () => {
  const token = useSelector((state) => state?.auth?.token);
  const { userIsAuthenticated } = useContext(AuthenticationContext);

  const [displayPage, setDisplayPage] = useState(false);
  const here = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    componentIsMounted = true;
    if (!token && userIsAuthenticated) {
      console.log("No Token");
      if (cmpntInitialized) return setDisplayPage(true);
      // To prevent double firing in react strict mode development
    
      cmpntInitialized = true;
      refreshAccessToken()
        .then((response) => {
          // Add the new Access token to redux store
          dispatch(addAuthToken({ token: response?.data?.accessToken }));

          return getUserProfile(); // Get user profile
        })
        .then((response) => {
          const user = response.data?.user;
          // Add authenticated user to redux store
          dispatch(addAuthUser({ user }));
        })
        .finally(() => {
          componentIsMounted && setDisplayPage(true);
        });
    } else {
      setDisplayPage(true);
    }

    return () => {
      componentIsMounted = false;
      console.log("CLEAN UP RAN: ", componentIsMounted);
    };
  }, []);

  if (!displayPage) {
    return "LOADING...";
  }
  if (!userIsAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ comingFrom: here, reason: "NOAUTH" }}
        replace
      />
    );
  }

  return <Outlet />;
};

export default PrivateRouteGuard;
