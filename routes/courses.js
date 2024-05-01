const express = require('express');
const router = express.Router();
const User = require('../Models/users');
const Course = require('../Models/courseModel');
const bcrypt = require('bcrypt');
const { sign } = require('jsonwebtoken');
const validateToken = require('../Middleware/AuthMiddleware');

router.get('/', async function (req, res) {
  const allCourses = await Course.find();
  res.json(allCourses);
})

router.post('/create', async function (req, res) {
  const { dp, title, them, instructor, accsess, syllabus, quizzes, videoLectures } = req.body;

  try {
    const newCourse = await Course.create({
      dp: dp,
      title: title,
      them: them,
      instructor: instructor,
      accsess: accsess || false,
      syllabus: syllabus || "", // Include syllabus field with default value
      quizzes: quizzes || [], // Include quizzes field with default value as an empty array
      videoLectures: videoLectures || [] // Include videoLectures field with default value as an empty array
    });
    res.json({ success: "course created successfully" });
  } catch (err) {
    res.json({ error: err });
  }
});

router.get('/byId/:id', async function (req, res) {
  try {
    const id = req.params.id;
    const singleCourse = await Course.findOne({ _id: id });
    res.json(singleCourse);
  } catch (err) {
    res.json({ error: err })
  }
});

router.post('/enroll/:courseId', validateToken, async (req, res) => {
  try {
    const courseId = req.params.courseId;
    const id = req.user.id;
    // Check if the course exists
    const course = await Course.findById(courseId);
    const courseName = course.title;

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Enroll the user in the course
    const updatedUser = await User.findByIdAndUpdate(
      id,
      {
        $push: {
          enrolledCourses: {
            courseId,
            courseName,
            // Add other course information if needed
          },
        },
      },
      { new: true } // Return the updated user document
    );

    res.json({ message: 'Enrollment successful', user: updatedUser });
  } catch (error) {
    console.error('Error enrolling user:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});


router.post('/testingToken', validateToken, async function (req, res, next) {
  const username = req.user.username;
  const id = req.user.id
  res.json({ username: username, id: id });
});

router.delete('/:id', async (req, res) => {
  try {
    const deletedCourse = await Course.findByIdAndDelete(req.params.id);
    if (!deletedCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    console.error('Failed to delete course:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/purchase', validateToken, async function (req, res) {
  const courseId = req.header('courseId')
  const courseName = req.header('coursName')
  const id = req.user.id

  try {
    const cc = await User.findByIdAndUpdate(
      id,
      {
        $push: {
          purchasedCourses: {
            courseId:courseId,
            courseName:courseName,
            // Add other course information if needed
          },
        },
      },
      { new: true } // Return the updated user document
    );
    if (cc) {
      res.json('done')
    } else {
      res.json('not done')
    }
  } catch {
    res.json('failed')
  }
})

router.get('/:category', async function (req, res) {
  const category = req.params.category;
  // console.log(req.params.category)
  const courses = await Course.find({ them: category });
  res.json(courses)
  console.log(courses);
  console.log(category);
})

module.exports = router

