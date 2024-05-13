import express from 'express';
import { addBook, addReview, search, viewReview } from '../controllers/bookController.js';
import { authenticateUser, isAuthor, isRetailUser } from '../middlewares/auth.js';

const router = express.Router();

// route for adding a book
router.post('/add-book', authenticateUser, isAuthor, addBook);

// route for searching and filtering
router.get('/search', search)

// route for adding review
router.post('/add-review/:bookId', authenticateUser, isRetailUser, addReview)

//route for viewing review
router.get('/view-review/:bookId', viewReview)


export default router;
