import express from 'express';
import dotenv from 'dotenv';
import adminRoutes from './src/routes/adminRoutes.js';
import userRoutes from './src/routes/userRoutes.js';

import { connect } from './src/config/database.js';
const app = express();
dotenv.config();


connect();

app.use(express.json());

app.use('/api/admin',adminRoutes);
app.use('/api/user',userRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});