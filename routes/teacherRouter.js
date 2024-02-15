const express = require('express');
const router = express.Router();
const Teacher = require('../Models/teachers');
const bcrypt = require('bcrypt');
const {sign} = require('jsonwebtoken');

// Route to create a new teacher account
router.post('/create', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Check if the email is already registered
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new teacher document
    const newTeacher = new Teacher({
      firstName,
      lastName,
      email,
      password: hashedPassword
    });

    // Save the new teacher document to the database
    await newTeacher.save();

    res.status(201).json({ success: 'Teacher account created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Find admin by email
    const teacher = await Teacher.findOne({ email });

    if (!teacher) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Compare passwords
    const passwordMatch = await bcrypt.compare(password, teacher.password);

    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const accessToken = sign({email:teacher.email, id:teacher._id},"hey");
          res.json(accessToken);

    // Return token
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
}
});

router.get('/all', async function(req, res){
  try {
    // Fetch all teachers from the database
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (error) {
    console.error('Failed to fetch teachers:', error);
    res.status(500).json({ error: 'Failed to fetch teachers' });
  }
})

router.delete('/:id', async (req, res) => {
  try {
    const deletedTeacher = await Teacher.findByIdAndDelete(req.params.id);
    if (!deletedTeacher) {
      return res.status(404).json({ error: 'Teacher not found' });
    }
    res.json({ message: 'Teacher deleted successfully' });
  } catch (error) {
    console.error('Failed to delete teacher:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
