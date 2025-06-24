const nodeMailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1) Create a transporter
  const transporter = nodeMailer.createTransport({
    // service: 'Gmail',
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // 2) Define the email options
  const mailOptions = {
    from: 'Yousef Elsrogy <yousef@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html: options.html, // Uncomment if you want to send HTML emails
  };
  // 3) Send the email
  transporter.sendMail(mailOptions);
};
module.exports = sendEmail;
