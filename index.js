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
const http = require('http');
const socketIo = require('socket.io');
const server = http.createServer(app);
const io = socketIo(server);

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use("/user",usersRouter);
app.use("/courses",coursesRouter);
app.use('/api', assignmentRoutes);
app.use('/comment', commentRouter);
app.use('/teacher',teacherRouter);
app.use('/admin',adminRouter);
app.use('/assignment',assignmentRoutes);
// app.use('/mail', mailer);


const transporter = nodemailer.createTransport({
    service: 'Gmail',
    secure:true,
    port:465,
    auth: {
      user: '',
      pass: ''
    }
  });
  const sendWelcomeEmail = (userEmail) => {
      const mailOptions = {
        from: 'abhaymeghnathi44@gmail.com',
        to: 'abhaygiri978@gmail.com',
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
      console.log('email sent')
    });

    app.get('/testmail', (req, res) => {
      sendWelcomeEmail('abhaygiri978@gmail.com');
      res.send('Test email sent!');
    });


app.listen(3001,()=>{
    console.log("server is running");
});