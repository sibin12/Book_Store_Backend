import Book from '../models/Books.js';

// function for adding a book
export const addBook = async (req, res) => {
    try {
        // Extract book data from request body
        const { title, authors, description, price } = req.body;

        // Check if price is within the range of 100 to 1000
        if (price < 100 || price > 1000) {
            return res.status(400).json({ message: 'Price must be between 100 and 1000' });
        }

        // Generate bookId (example: 'book-1', 'book-2', etc.)
        const count = await Book.countDocuments();
        const numericIncrementId = count + 1;
        const bookId = `book-${numericIncrementId}`;

        // Create new book instance
        const newBook = new Book({
            bookId,
            title,
            authors,
            description,
            price,
        });

        await newBook.save();

        res.status(201).json({ message: 'Book added successfully' });
    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern.title) {
            // Duplicate title error
            return res.status(400).json({ message: 'Title must be unique' });
        } else {
            console.error('Error adding book:', error);
            res.status(500).json({ message: 'Failed to add book' });
        }
    }
};
