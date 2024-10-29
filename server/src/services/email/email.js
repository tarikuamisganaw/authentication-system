const nodemailer = require("nodemailer");

// Pull in Environments variables
const EMAIL = {
  authUser: process.env.Auth_email,
  authPass: process.env.App_password,
};



async function main(mailOptions) {
  // Create reusable transporter object using the default SMTP transport
  const transporter = nodemailer.createTransport({
    gmail:"gmail",
    host: "smtp.gmail.com",
    port:  587,
    secure: false,
    auth: {
      user: EMAIL.authUser,
      pass: EMAIL.authPass,
    },
  }

);

  // Send mail with defined transport object
  const info = await transporter.sendMail({
    from: mailOptions?.from,
    to: mailOptions?.to,
    subject: mailOptions?.subject,
    text: mailOptions?.text,
    html: mailOptions?.html,
  });

  return info;
}

module.exports = main;
