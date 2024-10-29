const { validationResult } = require("express-validator");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const User = require("../../models/User");
const { sendEmail } = require("../../services/email/sendEmail");
const CustomError = require("../../config/errors/CustomError");
const AuthorizationError = require("../../config/errors/AuthorizationError");

// Top-level constants
const REFRESH_TOKEN = {
  secret: process.env.AUTH_REFRESH_TOKEN_SECRET,
  cookie: {
    name: "refreshTkn",
    options: {
      sameSite: "None",
      secure: true,
      httpOnly: true,
      expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  },
};
// const ACCESS_TOKEN = {
//   secret: process.env.AUTH_ACCESS_TOKEN_SECRET,
// };
const RESET_PASSWORD_TOKEN = {
  expiry: process.env.RESET_PASSWORD_TOKEN_EXPIRY_MINS,
};

/*
  1. LOGIN USER
*/
module.exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new CustomError(errors.array(), 422, errors.array()[0]?.msg);
    }

    const { email, password } = req.body;

    /* Custom methods on user are defined in User model */
    const user = await User.findByCredentials(email, password); // Identify and retrieve user by credentials
    const aTkn = await user.generateAcessToken(); // Create Access Token
    const refreshToken = await user.generateRefreshToken(); // Create Refresh Token

    // SET refresh Token cookie in response
    res.cookie(
      REFRESH_TOKEN.cookie.name,
      refreshToken,
      REFRESH_TOKEN.cookie.options
    );

    // Send Response on successful Login
    res.json({
      success: true,
      user,
      accessToken: aTkn,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/*
  2. SIGN UP USER 
*/
module.exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new CustomError(errors.array(), 422, errors.array()[0]?.msg);
    }
    const { firstName, lastName, email, password } = req.body;

    /* Custom methods on newUser are defined in User model */
    const newUser = new User({ firstName, lastName, email, password });
    await newUser.save(); // Save new User to DB
    const aTkn = await newUser.generateAcessToken(); // Create Access Token
    const refreshToken = await newUser.generateRefreshToken(); // Create Refresh Token

    // SET refresh Token cookie in response
    res.cookie(
      REFRESH_TOKEN.cookie.name,
      refreshToken,
      REFRESH_TOKEN.cookie.options
    );

    // Send Response on successful Sign Up
    res.status(201).json({
      success: true,
      user: newUser,
      accessToken: aTkn,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/*
  3. LOGOUT USER
*/
module.exports.logout = async (req, res, next) => {
  try {
    // Authenticated user ID attached on `req` by authentication middleware
    const userId = req.userId;
    const user = await User.findById(userId);

    const cookies = req.cookies;
    const refreshToken = cookies[REFRESH_TOKEN.cookie.name];
    // Create a refresh token hash
    const rTknHash = crypto
      .createHmac("sha256", REFRESH_TOKEN.secret)
      .update(refreshToken)
      .digest("hex");
    user.tokens = user.tokens.filter((tokenObj) => tokenObj.token !== rTknHash);
    await user.save();

    // Set cookie expiry option to past date so it is destroyed
    const expireCookieOptions = Object.assign(
      {},
      REFRESH_TOKEN.cookie.options,
      {
        expires: new Date(1),
      }
    );

    // Destroy refresh token cookie with `expireCookieOptions` containing a past date
    res.cookie(REFRESH_TOKEN.cookie.name, "", expireCookieOptions);
    res.status(205).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/*
  4. LOGOUT USER FROM ALL DEVICES
*/
module.exports.logoutAllDevices = async (req, res, next) => {
  try {
    // Authenticated user ID attached on `req` by authentication middleware
    const userId = req.userId;
    const user = await User.findById(userId);

    user.tokens = undefined;
    await user.save();

    // Set cookie expiry to past date to mark for destruction
    const expireCookieOptions = Object.assign(
      {},
      REFRESH_TOKEN.cookie.options,
      {
        expires: new Date(1),
      }
    );

    // Destroy refresh token cookie
    res.cookie(REFRESH_TOKEN.cookie.name, "", expireCookieOptions);
    res.status(205).json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};

/*
  5. REGENERATE NEW ACCESS TOKEN
*/
module.exports.refreshAccessToken = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const refreshToken = cookies[REFRESH_TOKEN.cookie.name];

    if (!refreshToken) {
      throw new AuthorizationError(
        "Authentication error!",
        undefined,
        "You are unauthenticated",
        {
          realm: "Obtain new Access Token",
          error: "no_rft",
          error_description: "Refresh Token is missing!",
        }
      );
    }

    const decodedRefreshTkn = jwt.verify(refreshToken, REFRESH_TOKEN.secret);
    const rTknHash = crypto
      .createHmac("sha256", REFRESH_TOKEN.secret)
      .update(refreshToken)
      .digest("hex");
    const userWithRefreshTkn = await User.findOne({
      _id: decodedRefreshTkn._id,
      "tokens.token": rTknHash,
    });
    if (!userWithRefreshTkn)
      throw new AuthorizationError(
        "Authentication Error",
        undefined,
        "You are unauthenticated!",
        {
          realm: "Obtain new Access Token",
        }
      );

    // GENERATE NEW ACCESSTOKEN
    const newAtkn = await userWithRefreshTkn.generateAcessToken();

    res.status(201);
    res.set({ "Cache-Control": "no-store", Pragma: "no-cache" });

    // Send response with NEW accessToken
    res.json({
      success: true,
      accessToken: newAtkn,
    });
  } catch (error) {
    if (error?.name === "JsonWebTokenError") {
      next(
        new AuthorizationError(error, undefined, "You are unauthenticated", {
          realm: "Obtain new Access Token",
          error_description: "token error",
        })
      );
      return;
    }
    next(error);
  }
};

/*
  6. FORGOT PASSWORD
*/
module.exports.forgotPassword = async (req, res, next) => {
  const MSG = `we've sent an email to ${
    req.body?.email || "__"
  } with instructions to reset your password.`;

  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new CustomError(errors.array(), 422);
    }

    const email = req.body.email.trim();
    const user = await User.findOne({ email });

    // If email is not found, throw an exception BUT with 200 status code for security reasons.
    if (!user) throw new CustomError("Reset link sent", 200, MSG);

    let resetToken;
    try {
      resetToken = await user.generateResetToken();
      resetToken = encodeURIComponent(resetToken);
      console.log("Encoded Reset Token:", resetToken);
    } catch (error) {
      console.error("Error generating reset token:", error);
      throw new CustomError("Failed to generate reset token", 500);
    }

    // Retrieve headers to construct the reset URL
    const resetPath = req.header("X-reset-base");
    const origin = req.header("Origin");
    const resetUrl = resetPath
      ? `${resetPath}/${resetToken}`
      : `${origin}/resetpass/${resetToken}`;
    console.log("Password reset URL:", resetUrl);

    const emailMessage = `
            <h1>You have requested to change your password</h1>
            <p>Please click on the following link, or paste it in your browser to complete the password reset.</p>
            <p>
              <a href=${resetUrl} clicktracking=off>${resetUrl}</a>
            </p>
            <p>
              <em>If you did not request this, you can safely ignore this email, and your password will remain unchanged.</em>
            </p>
            <p>
              <strong>DO NOT share this link with anyone else!</strong><br />
              <small>
                <em>This password reset link will <strong>expire after ${
                  RESET_PASSWORD_TOKEN.expiry || 5
                } minutes.</strong></em>
              <small/>
            </p>
        `;

    try {
      await sendEmail({
        to: user.email,
        html: emailMessage,
        subject: "Reset password",
      });

      res.json({
        message: "Reset link sent",
        feedback: MSG,
        success: true,
      });
    } catch (error) {
      user.resetpasswordtoken = undefined;
      user.resetpasswordtokenexpiry = undefined;
      await user.save();

      console.error("Error sending email:", error.message);
      throw new CustomError("Internal issues standing in the way", 500);
    }
  } catch (err) {
    next(err);
  }
};


/*
  7. RESET PASSWORD
*/
module.exports.resetPassword = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new CustomError(errors.array(), 422);
    }

    const resetToken = new String(req.params.resetToken);

    const [tokenValue, tokenSecret] = decodeURIComponent(resetToken).split("+");

    // Recreate the reset Token hash
    const resetTokenHash = crypto
      .createHmac("sha256", tokenSecret)
      .update(tokenValue)
      .digest("hex");

    const user = await User.findOne({
      resetpasswordtoken: resetTokenHash,
      resetpasswordtokenexpiry: { $gt: Date.now() },
    });
    if (!user) throw new CustomError("The reset link is invalid", 400);

    user.password = req.body.password; // Will be hashed by mongoose middleware
    user.resetpasswordtoken = undefined;
    user.resetpasswordtokenexpiry = undefined;

    await user.save();

    // Email to notify owner of the account
    const message = `<h3>This is a confirmation that you have changed Password for your account.</h3>`;
    // No need to await
    sendEmail({
      to: user.email,
      html: message,
      subject: "Password changed",
    });

    res.json({
      message: "Password reset successful",
      success: true,
    });
  } catch (error) {
    console.log(error);
    next(error);
  }
};
