import mongoose from "mongoose";
import PurchaseHistory from '../models/PurchaseHistory.js'

const bookSchema = new mongoose.Schema({
    bookId: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
        unique: true
    },
    authors: {
        type: [String],
        required: true
    },
    description: {
        type: String
    },
    price: {
        type: Number,
        required: true,
        min: 100, max: 1000
    },
    sellCount: {
        type: Number,
        default: 0
    }
});



bookSchema.pre('save', async function(next) {
    try {
        // Fetch purchase history for this book
        const purchaseHistory = await PurchaseHistory.find({ bookId: this._id });
        
        // Compute total sell count based on purchase history
        this.sellCount = purchaseHistory.reduce((total, purchase) => total + purchase.quantity, 0);
        
        next();
    } catch (error) {
        next(error);
    }
});

const Book = mongoose.model('Book', bookSchema);

export default Book;
