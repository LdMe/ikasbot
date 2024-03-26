/*
Stats model

It relates a user with a subject and it contains some statistics about the user's performance in that subject.
attributes:
    user: {type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true},
    subject: {type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true},
    correctExercises: Number,
    totalExercises: Number,
*/

import mongoose from 'mongoose';
const SubjectStatsSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    subject: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: true
    },
    correctExercises: Number,
    totalExercises: Number,
});
const Stats = mongoose.model('SubjectStats', SubjectStatsSchema);
export default Stats