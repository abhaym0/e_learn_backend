const mongoose = require('mongoose');

const teacherSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  coursesTaught: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course'
    }
  ],
  dateJoined: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Teacher', teacherSchema);

