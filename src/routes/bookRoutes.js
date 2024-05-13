import express from 'express';
import { addBook } from '../controllers/bookController.js';
import { authenticateUser, isAuthor } from '../middlewares/auth.js';

const router = express.Router();

// route for adding a book
router.post('/books', authenticateUser, isAuthor, addBook);

// route for searching



export default router;
