// Import Nodemailer and configure transporter
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
    user: 'abhaymeghnathi44@gmail.com',
    pass: 'SUPER***123'
  }
});

// Function to send welcome email
const sendWelcomeEmail = (userEmail) => {
  const mailOptions = {
    from: 'abhaymeghnathi44@gmail.com',
    to: userEmail,
    subject: 'Welcome to Our Application',
    html: '<p>Hello, Welcome to our application!</p>'
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error sending email:', error);
    } else {
      console.log('Email sent:', info.response);
    }
  });
};

// Route handler for user registration
router.post('/register', (req, res) => {
  // Process user registration and save user data to database
  // After successful registration, send welcome email
  sendWelcomeEmail(req.body.email);
  res.send('User registered successfully');
});
