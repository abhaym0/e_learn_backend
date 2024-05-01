const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/learn');


const Schema = mongoose.Schema;
const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    fullname: {
        type: String,
        required: true
    },
    // New fields for student dashboard
    enrolledCourses: [
        {
            courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
            courseName:String,
        }
    ],
    purchasedCourses:[
        {
            courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
            courseName:String,
        }
    ],
    isVerified:{
        type:Boolean,
        default:false
    },
    verificationToken:{
        type: String
    }
    // Add more fields as needed for other dashboard features
});

module.exports = mongoose.model("User", userSchema);

