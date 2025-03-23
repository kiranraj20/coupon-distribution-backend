import express from 'express';
import { json } from 'express';
import mongoose from 'mongoose';
import cookieParser from 'cookie-parser';
import couponRoutes from './routes/coupon.js';
import authRoutes from './routes/auth.js';
import dotenv from 'dotenv';
import cors from 'cors';
import corsMiddleware from './middleware/cors.js';


const app = express();

app.use(json());
app.use(cookieParser());
dotenv.config();
   
app.use(corsMiddleware);

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('MongoDB Connected Successfully');
  })
  .catch((err) => {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  });

app.use('/api', couponRoutes);
app.use('/api/admin', authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));