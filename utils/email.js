const nodeMailer = require('nodemailer');

const sendEmail = async (options) => {
  let transporter;

  if (process.env.NODE_ENV === 'development') {
    // Use Ethereal Email for development (creates test account automatically)
    try {
      const testAccount = await nodeMailer.createTestAccount();

      transporter = nodeMailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
    } catch (error) {
      throw error;
    }
  } else {
    // Production Mailtrap configuration
    transporter = nodeMailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });
  }

  // Define the email options
  const mailOptions = {
    from: 'Yousef Elsrogy <noreply@natours.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  try {
    // Send the email
    const result = await transporter.sendMail(mailOptions);

    return result;
  } catch (error) {
    throw error;
  }
};

module.exports = sendEmail;
