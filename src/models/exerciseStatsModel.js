/*
Stats model

It relates a user with a exercise and it contains some statistics about the user's performance in that exercise.
attributes:
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    exercise: {type: mongoose.Schema.Types.ObjectId, ref: 'Exercise', required: true},
    correctTests: {type: Number, default: 0},
    totalTests: {type: Number, default: 0},
    bestAttempt: {type: mongoose.Schema.Types.ObjectId, ref: 'Attempt'},
    totalAttempts: {type: Number, default: 0},
*/

import mongoose from 'mongoose';
import SubjectStats from './subjectStatsModel.js';
import Exercise from './exerciseModel.js';

const ExerciseStatsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    exercise: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
        required: true
    },
    subjectStats: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubjectStats',
        required: false
    },
    correctTests: {
        type: Number,
        default: 0
    },
    totalTests: {
        type: Number,
        default: 0
    },
    bestAttempt: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Attempt'
    },
    bestAttemptDate: {
        type: Date
    },
    totalAttempts: {
        type: Number,
        default: 0
    },
    success: {
        type: Boolean,
        default: false
    },
});

// after saving the stats, update the subject's stats
ExerciseStatsSchema.pre('save', async function() {
    
    const exerciseStats = this;
    const exercise = await Exercise.findById(exerciseStats.exercise);
    const subjectStats = await SubjectStats.findOne({user: exerciseStats.user, subject: exercise.subject});
    const exercises = await Exercise.find({subject: exercise.subject, isDraft: false});
    const correctExercises= await Stats.find({user: exerciseStats.user, exercise: {$in: exercises.map(exercise => exercise._id)}, success: true});
    const uniqueCorrectExercises = [...new Set(correctExercises.map(attempt => attempt.exercise))];
    let correctExerciseCount = uniqueCorrectExercises.length;
    console.log("correct exercises",uniqueCorrectExercises);
    console.log("exerciseStats.exercise",exerciseStats.exercise);
     if ( exerciseStats.success && uniqueCorrectExercises.findIndex(exercise => exercise._id.toString() === exerciseStats.exercise.toString()) === -1) {
        console.log("new correct exercise");
        correctExerciseCount++;
    }
    console.log("correct exercises",correctExerciseCount,correctExercises.length);
    if(subjectStats) {
        subjectStats.correctExercises = correctExerciseCount;
        subjectStats.totalExercises = exercises.length;
        exerciseStats.subjectStats = subjectStats._id;
        await subjectStats.save();
    }
    else {
        const newSubjectStats = await SubjectStats.create({
            user: exerciseStats.user,
            subject: exercise.subject,
            correctExercises: correctExerciseCount,
            totalExercises: exercises.length
        })
        exerciseStats.subjectStats = newSubjectStats._id;
    }

})
const Stats = mongoose.model('ExerciseStats', ExerciseStatsSchema);
export default Stats