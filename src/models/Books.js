import mongoose from "mongoose";
import PurchaseHistory from '../models/PurchaseHistory.js'

const reviewSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    rating: {
        type: Number,
        required: true,
        min: 1, max: 5
    },
    comment: {
        type: String
    }
}, { timestamps: true });

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
    },
    reviews: [reviewSchema] 

});


const Book = mongoose.model('Book', bookSchema);

export default Book;
