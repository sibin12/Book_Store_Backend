import express from 'express';
import dotenv from 'dotenv';
import purchaseRoutes from './src/routes/purchaseRoutes.js';
import authRoutes from './src/routes/authRoutes.js';
import bookRoutes from './src/routes/bookRoutes.js';
import sendRevenueEmailToAuthors from './src/utils/revenueTracker.js'

import { connect } from './src/config/database.js';
const app = express();
dotenv.config();


connect();
sendRevenueEmailToAuthors()

app.use(express.json());
app.use(express.urlencoded({ extended: true }))


app.use('/api/auth', authRoutes);
app.use('/api/book', bookRoutes);
app.use('/api/user', purchaseRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});