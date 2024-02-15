const express = require('express');
const app = express();
const userModel = require('./Models/users'); 
const usersRouter = require('./routes/userroute');
const coursesRouter = require('./routes/courses');
const commentRouter = require('./routes/comments');
const teacherRouter = require('./routes/teacherRouter');
const adminRouter = require('./routes/adminRouter');
const mailer = require('./routes/mail')
const cors = require('cors');
const assignmentRoutes = require('./routes/assigenment');
const nodemailer = require('nodemailer');

app.use(express.json());
app.use(cors());
app.use(express.json());
app.use("/user",usersRouter);
app.use("/courses",coursesRouter);
app.use('/api', assignmentRoutes);
app.use('/comment', commentRouter);
app.use('/teacher',teacherRouter);
app.use('/admin',adminRouter);
app.use(express.urlencoded({ extended: true }));
// app.use('/mail', mailer);


const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: 'abhaymeghnathi44@gmail.com',
      pass: 'SUPER***123'
    }
  });
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
    app.post('/register', (req, res) => {
     const email = req.body.email;
     sendWelcomeEmail(email);
      res.send(email);
    });


app.listen(3001,()=>{
    console.log("server is running");
});