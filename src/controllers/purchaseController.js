import PurchaseHistory from '../models/PurchaseHistory.js';
import Book from '../models/Books.js';
import { sendPurchaseNotificationToAuthors } from '../utils/purchaseNotification.js';
import { Mutex } from 'async-mutex';
const mutex = new Mutex();



//function for Purchase a book
export const purchase = async (req, res) => {
    try {
        // await PurchaseHistory.deleteMany({})
        const { bookId, userId, quantity } = req.body;
        // await PurchaseHistory.deleteMany({})
        if (!bookId || !quantity || quantity <= 0) {
            return res.status(400).json({ message: 'Invalid bookId or quantity' });
        }

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }
// for concurrecy controll.
        await mutex.acquire();
        const purchaseDate = new Date();
        const year = purchaseDate.getFullYear();
        const month = String(purchaseDate.getMonth() + 1).padStart(2, '0');

        const lastPurchase = await PurchaseHistory.findOne({}).sort({ purchaseId: -1 });

        let numericIncrementId = 1;
        if (lastPurchase) {
            console.log(lastPurchase.purchaseId)
            let [lastYear, lastMonth, lastId] = lastPurchase.purchaseId.split('-');
            
            // if (year === parseInt(lastYear) && month === lastMonth) {
                numericIncrementId = parseInt(lastId) + 1;
            // }
        }
        const purchaseId = `${year}-${month}-${(numericIncrementId.toString()).padStart(4, 0)}`;
        console.log(purchaseId,"iddidididididididi");

        const newPurchase = new PurchaseHistory({
            purchaseId,
            bookId,
            userId,
            purchaseDate,
            price: book.price,
            quantity
        });

        book.sellCount += quantity;

        const purchase = {book,quantity}
        // sendPurchaseNotificationToAuthors(purchase)

        await Promise.all([newPurchase.save(), book.save()]);

        res.status(201).json({ message: 'Purchase successful', purchaseId });
    } catch (error) {
        console.error('Error purchasing book:', error.message);
        res.status(500).json({ message: 'Failed to purchase book' });
    } finally {
        mutex.release();
    }
}


// function for viewing purhcase history
export const purchaseHistory = async (req, res) => {
    try {
        const purchaseHistory = await PurchaseHistory.find({ userId: req.userData.userId })
            .populate('bookId', 'title authors description price sellCount');

        res.json(purchaseHistory);

    } catch (error) {
        console.error('Error fetching purchase history:', error);
        res.status(500).json({ message: 'Failed to fetch purchase history' });
    }
}

