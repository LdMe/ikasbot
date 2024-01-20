// file that contains the connection to the database
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || '27017';
const DB_NAME = process.env.DB_NAME || 'exercises';
const DB_ROOT_USERNAME = process.env.DB_ROOT_USERNAME || '';
const DB_ROOT_PASSWORD = process.env.DB_ROOT_PASSWORD || '';
console.log("------------------",DB_HOST, DB_PORT, DB_NAME, DB_ROOT_USERNAME, DB_ROOT_PASSWORD);


const DB_URI = `mongodb://${DB_ROOT_USERNAME}:${DB_ROOT_PASSWORD}@${DB_HOST}:${DB_PORT}`;
console.log("DB_URI----",DB_URI);
const connectDB = async () => {
    try {
        await mongoose.connect(DB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('Connected to database');
    } catch (err) {
        console.log(err);
    }
}

export default connectDB;



