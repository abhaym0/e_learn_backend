// Import necessary modules
const express = require('express');
const router = express.Router();
const multer = require('multer'); // Assuming you're using multer for file uploads

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/assigenment/'); // Specify the directory where files will be stored
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + '-' + file.originalname); // Use a unique filename
  },
});

const upload = multer({ storage });

// Define your route
router.post('/submitAssignment', upload.single('file'), (req, res) => {
  const { title, description, file } = req.body;

  // Process the assignment and save it to the database (if needed)

  // Return a JSON response
  res.status(201).json({
    success: true,
    message: 'Assignment submitted successfully!',
    assignment: {
      title,
      description,
      fileUrl: file ? file.path : null,
    },
  });
});

module.exports = router;
