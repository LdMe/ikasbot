import Jwt from "jsonwebtoken";
import User from "../models/userModel.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();


const register = async (req, res) => {
    try{
        const { username, password, passwordConfirm } = req.body;
        const oldUser =await User.findOne({ username });
        if (oldUser) {
            res.status(409).json({error:"User already exists"});
            return;
        }
        if (password !== passwordConfirm) {
            res.status(401).json({error:"Passwords do not match"});
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ username, password: hashedPassword });
        await user.save();
        res.json(user);
    }
    catch (e) {
        console.error(e);
        res.status(500).json({error:"Error registering user"});
    }
}

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
    const oldUser = await User.findOne({ username });
    if (!oldUser) {
        res.status(404).json({error:"User does not exist"});
        return;
    }
    const isPasswordCorrect = await bcrypt.compare(password, oldUser.password);
    if (!isPasswordCorrect) {
        res.status(400).json({error:"Invalid credentials"});
        return;
    }
    const token = Jwt.sign({ username: oldUser.username, id: oldUser._id,role:oldUser.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
    /* send token in a cookie */
    res.cookie("token", token, { 
        httpOnly: true,
        secure: true,
        sameSite: 'none',
        maxAge: 3600000

     });

    res.status(200).json({
        user:
        {
            username: oldUser.username,
            id: oldUser._id,
            role: oldUser.role
        },
        token
    });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({error:"Error loggin user"})
    }
    
}

const logout = async (req, res) => {
    res.clearCookie("token");
    res.status(200).json({error:"Logged out"});
}

const refresh = async (req, res) => {
    try {
        const cookie = req.headers.cookie;
        if(!cookie){
            res.status(401).json({error:"Unauthorized: No cookie provided"});
            return;
        }
        const token = cookie.split("=")[1];

        if (!token) {
            res.status(401).json({error:"Unauthorized: No token provided"});
            return;
        }
        const decoded = Jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);
        if (!user) {
            res.status(401).json({error:"Unauthorized: Invalid token"});
            return;
        }
        const newToken = Jwt.sign({ username: user.username, id: user._id,role:user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("token", newToken, { 
            httpOnly: true,
            secure: true,
            sameSite: 'none',
            maxAge: 3600000
         });
        res.status(200).json({
            user:
            {
                username: user.username,
                id: user._id,
                role: user.role
            },
            token:newToken
        });
    } catch (error) {
        console.error(error);
        res.status(401).json({error:"Unauthorized: Invalid token"});
        return;
    }
}


export default { register, login,logout,refresh};