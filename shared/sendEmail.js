const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(data) {
  const msg = {
    ...data,
    from: process.env.SENDGRID_FROM_EMAIL,
  };
  try {
    await sgMail.send(msg);
  } catch (error) {
    console.log(error);
  }
}

module.exports = sendEmail;
