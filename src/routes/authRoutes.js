import express from 'express';
import { login, signup } from '../controllers/authController.js';

const router = express.Router();

//signup route for all the users
router.post('/signup', signup);

//login route for all users
router.post('/login', login);

export default router;