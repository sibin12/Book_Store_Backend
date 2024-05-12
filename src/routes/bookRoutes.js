import express from 'express';
import { addBook } from '../controllers/bookController.js';
import { authenticateUser, isAuthor } from '../middlewares/auth.js';

const router = express.Router();

// POST route for adding a book
router.post('/books',authenticateUser, isAuthor, addBook);

export default router;
