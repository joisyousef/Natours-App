const nodeMailer = require('nodemailer');

const sendEmail = async (options) => {
  console.log('📧 Creating email transporter...');

  let transporter;

  if (process.env.NODE_ENV === 'development') {
    // Use Ethereal Email for development (creates test account automatically)
    console.log('🔧 Using Ethereal Email for development...');

    try {
      const testAccount = await nodeMailer.createTestAccount();
      console.log('✅ Test account created:', testAccount.user);

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
      console.error('❌ Failed to create Ethereal test account:', error);
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

  // 2) Define the email options
  const mailOptions = {
    from: 'Yousef Elsrogy <noreply@natours.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  console.log('📧 Sending email to:', options.email);

  try {
    // 3) Send the email
    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent successfully!');
    console.log('Message ID:', result.messageId);

    // Show preview URL for development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔗 Preview URL:', nodeMailer.getTestMessageUrl(result));
    }

    return result;
  } catch (error) {
    console.error('❌ Email sending failed:', error);
    throw error;
  }
};

module.exports = sendEmail;
