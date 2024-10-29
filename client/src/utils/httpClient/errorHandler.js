import { authUserLogout } from "../../redux/features/auth/authSlice";
import { newNotify } from "../../redux/features/notify/notifySlice";

/**
 * Axios Error Handler
 * @param {Error} error - Error object
 * @param {Object} store - Redux Store
 */
function logError(error, store) {

  if (error.response) {
    // API we request to always includes `error` or `feedback` in error response
    const { error: respMessage, feedback: respFeedback } = error.response.data;

    const DEFAULTMSG = "Something's not right:( Try again later.";
    let notificationMsg = respFeedback || respMessage || DEFAULTMSG;

    if (error.response.status === 401) {
      notificationMsg = "You need to Log In";

      // Fire redux store logout action
      store?.dispatch(authUserLogout());
    }

    // Fire to redux store with notification data
    store?.dispatch(
      newNotify({
        variant: error.response.status,
        msg: notificationMsg,
      })
    );
  }
 
  else if (error.request) {
    // Add custom variable on window object when network error occurs
    if (error?.code === "ERR_NETWORK") window.NetworkError = error?.code;

    store?.dispatch(
      newNotify({
        variant: "danger",
        msg: error.message,
      })
    );
  }
  
  else {
    store?.dispatch(
      newNotify({
        variant: "danger",
        msg: "Oh no! An Error Occured!",
      })
    );
  }
}

export default logError;
