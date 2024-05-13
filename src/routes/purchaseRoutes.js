import express from 'express';
import { authenticateUser, isRetailUser } from '../middlewares/auth.js';
import { purchase, purchaseHistory } from '../controllers/purchaseController.js';

const router = express.Router();

// route for adding a book
router.post('/purchase',authenticateUser, isRetailUser, purchase);

// route for viewing purchase history
router.get('/purchase-history', authenticateUser, isRetailUser, purchaseHistory )

export default router;