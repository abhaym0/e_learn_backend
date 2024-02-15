const express = require('express');
const router = express.Router();
const User = require('../Models/users');
const Course = require('../Models/courseModel');
const validateToken = require('../Middleware/AuthMiddleware');

// Endpoint to add a comment to a course
router.post('/addComment/:id',validateToken, async (req, res) => {
    const courseId = req.params.id;
    const username = req.user.username;
    const id = req.user.id
    const { commentText} = req.body;
  
    try {
      const course = await Course.findById(courseId);
  
      if (!course) {
        return res.status(404).json({ message: 'Course not found' });
      }
  
      // Add the new comment to the course
      course.comments.push({
        user: id,
        username: username,
        commentText,
      });
  
      // Save the updated course
      const updatedCourse = await course.save();
  
      res.status(201).json(updatedCourse);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  });
  

module.exports = router