import mongoose from 'mongoose';

const isValidObjectId = (id) => {
    if(!id) return false;
    return mongoose.Types.ObjectId.isValid(id);
}


export { 
    isValidObjectId,
 };