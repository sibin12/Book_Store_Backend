import mongoose from "mongoose";

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

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
