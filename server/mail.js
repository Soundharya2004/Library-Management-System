const nodemailer = require('nodemailer');
require('dotenv').config(); // Load environment variables from .env file

const sendEmail = async (to, subject, text) => {
  try {
    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail', // Specify Gmail as the email service provider
      port: 465, // Port number
      secure: true, // Use SSL
      logger: true, // Enable logging
      debug: true, // Enable debugging
      secureConnection: false, // Allow insecure connections
      auth: {
        user: "bidblogger19@gmail.com", // Use environment variable for email address
        pass: "kgsqquqjagdvypje", // Use environment variable for email password
      }, 
      tls: {
        rejectUnauthorized: false // Allow insecure TLS connections
      }
    });

    // Define email options
    const mailOptions = {
      from: process.env.GMAIL_USER, // Use your email address as sender
      to, // Recipient's email address
      subject, // Email subject
      text, // Email body
    };

    // Send the email
    await transporter.sendMail(mailOptions);

    console.log('Email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};

module.exports = sendEmail;
