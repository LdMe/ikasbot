// Solution model
import mongoose from 'mongoose';

const solutionSchema = new mongoose.Schema({
    code: String,
    createdBy:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    exercise:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Exercise',
        required: false
    }
    });

const Solution = mongoose.model('Solution', solutionSchema);

export default Solution;

