import mongoose from 'mongoose';
import Jwt from "jsonwebtoken";

const isValidObjectId = (id) => {
    if (!id) return false;
    return mongoose.Types.ObjectId.isValid(id);
}
const createTokenCookie = (user, res,expiresIn="1h") => {
    const token = Jwt.sign({ name: user.name, email: user.email, id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn});
    /* send token in a cookie */
    res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 3600000
    });
    return token;
}

export {
    isValidObjectId,
    createTokenCookie
};