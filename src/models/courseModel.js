import mongoose from "mongoose";

const courseSchema = new mongoose.Schema({
    name: String,
    year: Number,
    month: Number,
    branch: {
        type: String,
        enum: ['FS', 'DS'],
        default: 'FS'
    },
    teachers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    }],

});

const Course = mongoose.model('Course', courseSchema);

export default Course;
