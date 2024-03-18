// Exercise model
import mongoose from 'mongoose';

const exerciseSchema = new mongoose.Schema({
    name: String,
    description: String,
    test: String,
    level: String,
    isDraft: {
        type: Boolean,
        default: true
    },
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    subject:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Subject',
        required: false
    },
    });
const Exercise = mongoose.model('Exercise', exerciseSchema);

export default Exercise;

