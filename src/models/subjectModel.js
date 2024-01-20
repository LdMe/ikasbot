import mongoose from "mongoose";

const subjectSchema = new mongoose.Schema({
    name: String,
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: false
    },
});

const Subject = mongoose.model('Subject', subjectSchema);

export default Subject;