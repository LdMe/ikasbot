// Attempt model
import mongoose from 'mongoose';
const attemptSchema = new mongoose.Schema({
    code: String,
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    exercise: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
        required: false
    },
    success: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    correct_percentage: Number,
    correct_tests: Number,
    total_tests: Number,
    execution_time: Number,
    message: String
});

// every time before an attempt is saved, update the exercise's correct percentage and execution time
attemptSchema.pre('save', async function (next) {
    const attempt = this;
    if(!attempt.message){
        attempt.correct_percentage = 0;
        attempt.correct_tests = 0;
        attempt.total_tests = 0;
        attempt.execution_time = 0;
        attempt.success = false;
        attempt.message = "No se ha podido ejecutar el código";
        return next();
    }
    
    // get correct percentage
    let regex = /Tests:\s+(\d+)\s+passed,\s+(\d+)\s+total/;
    if(!attempt.success){
        regex = /Tests:\s+\d+\s+failed,\s+(\d+)\s+passed,\s+(\d+)\s+total/;
    }
    const match = attempt.message.match(regex);
    let correct_percentage = 0;
    let correct_tests = 0;
    let total_tests = 0;
    if (match) {
        correct_tests = parseInt(match[1]);
        total_tests = parseInt(match[2]);
         correct_percentage = correct_tests / total_tests * 100;
        
    }
    else {
        regex = /Tests:\s+\d+\s+failed,\s+(\d+)\s+total/;
        const match = attempt.message.match(regex);
        if (match) {
            total_tests = parseInt(match[1]);
        }
    }
    attempt.correct_percentage = correct_percentage;
    attempt.correct_tests = correct_tests;
    attempt.total_tests = total_tests;

    // get execution time
    regex = /Time:\s+(\d.?\d+)\s+s/;
    const match2 = attempt.message.match(regex);
    let execution_time = 0;
    if (match2) {
        execution_time = parseFloat(match2[1]);
    }
    attempt.execution_time = execution_time;
    return next();
});

const Attempt = mongoose.model('Attempt', attemptSchema);



export default Attempt;

