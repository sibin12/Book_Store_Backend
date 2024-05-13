import PurchaseHistory from '../models/PurchaseHistory.js';
import Book from '../models/Books.js';

// Purchase a book
export const purchase = async (req, res) => {
    try {
        const { bookId, userId, quantity } = req.body;

        // Check if bookId and quantity are provided
        if (!bookId || !quantity || quantity <= 0) {
            return res.status(400).json({ message: 'Invalid bookId or quantity' });
        }

        // Find the book by its ID
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }


        // Create a unique purchase ID
        const purchaseDate = new Date();
        const year = purchaseDate.getFullYear();
        const month = String(purchaseDate.getMonth() + 1).padStart(2, '0'); // Add leading zero if month is single digit
        const lastPurchase = await PurchaseHistory.findOne({}).sort({ purchaseId: -1 });
        let numericIncrementId = 1;
        if (lastPurchase) {
            const [lastYear, lastMonth, lastId] = lastPurchase.purchaseId.split('-');
            if (year === parseInt(lastYear) && month === lastMonth) {
                numericIncrementId = parseInt(lastId) + 1;
            }
        }
        const purchaseId = `${year}-${month}-${numericIncrementId}`;

        // Create a new purchase record
        const newPurchase = new PurchaseHistory({
            purchaseId,
            bookId,
            userId,
            purchaseDate,
            price: book.price,
            quantity
        });

        // Increment sellCount of the book
        book.sellCount += quantity;

        // Save the purchase record and update the book sellCount
        await Promise.all([newPurchase.save(), book.save()]);

        res.status(201).json({ message: 'Purchase successful', purchaseId });
    } catch (error) {
        console.error('Error purchasing book:', error);
        res.status(500).json({ message: 'Failed to purchase book' });
    }
}



// viewing purhcase history
export const purchaseHistory = async (req, res) => {
    try {
        // Fetch purchase history for the authenticated user
        const purchaseHistory = await PurchaseHistory.find({ userId: req.userData.userId })
            .populate('bookId', 'title authors description price sellCount');

        res.json(purchaseHistory);

    } catch (error) {
        console.error('Error fetching purchase history:', error);
        res.status(500).json({ message: 'Failed to fetch purchase history' });
    }
}

