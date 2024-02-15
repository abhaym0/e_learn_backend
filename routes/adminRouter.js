const express = require('express');
const bcrypt = require('bcrypt');
const Admin = require('../Models/admin');
const {sign} = require('jsonwebtoken');
const router = express.Router();

// Route to handle admin creation
router.post('/create', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if admin with the same email already exists
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Admin with this email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin document
    const newAdmin = new Admin({
      username,
      email,
      password: hashedPassword
    });

    // Save the admin document to the database
    await newAdmin.save();

    res.status(201).json({ message: 'Admin created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
  
    try {
      // Find admin by email
      const admin = await Admin.findOne({ email });
  
      if (!admin) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      // Compare passwords
      const passwordMatch = await bcrypt.compare(password, admin.password);
  
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
  
      // Generate JWT token
      const accessToken = sign({email:admin.email, id:admin._id},"hey");
            res.json(accessToken);
  
      // Return token
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.get('/admins',async function(req,res){
    try {
      // Fetch all teachers from the database
      const allAdmins = await Admin.find();
      res.json(allAdmins);
    } catch (error) {
      console.error('Failed to fetch admins:', error);
      res.status(500).json({ error: 'Failed to fetch teachers' });
    }
  })

module.exports = router;
