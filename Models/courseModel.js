const mongoose = require('mongoose');
const User = require('../Models/users');
const Schema = mongoose.Schema;
const courseSchema = new Schema({
    dp: {
        type: String,
        required: true,
        unique: false
    },
    title: {
        type: String,
        required: true,
        unique: false
    },
    them: {
        type: String,
        required: true,
        unique: false
    },
    instructor: {
        type: String,
        required: true,
        unique: false
    },
    accsess: {
        type: Boolean,
        required: true
    },
    syllabus: {
        type: String,
        required: false
    },
    quizzes: [{
        title: String,
        questions: [{
            question: String,
            options: [String],
            correctAnswer: String
        }]
    }],
    videoLectures: [{
        title: String,
        url: String,
        dp: String
    }],
    comments: [{
        user: {
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        username: {
            type: String,
            required: true
        },
        commentText: {
            type: String,
            required: true
        }
    }],
    category: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model("Course", courseSchema);
