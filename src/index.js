import express from 'express';
import router from './routes/router.js';
import dotenv from 'dotenv';
import connectDB from './utils/db.js';
import cors from 'cors';
dotenv.config();
const app = express();
connectDB();
const corsOptions = {
    origin: 'http://localhost:5173',
    credentials: true,
}
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(router);
const APP_PORT = process.env.APP_PORT || 3000; 
app.listen(APP_PORT, () => {
    console.log(`Server runnin on port ${APP_PORT}`);
    }
);

