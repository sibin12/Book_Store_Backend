import Book from '../models/Books.js';
import User from '../models/Users.js';
import agenda from '../utils/agenda.js'

// function for adding a book
export const addBook = async (req, res) => {
    try {
        const { title, authors, description, price } = req.body;

        if (price < 100 || price > 1000) {
            return res.status(400).json({ message: 'Price must be between 100 and 1000' });
        }

        const count = await Book.countDocuments();
        const numericIncrementId = count + 1;
        const bookId = `book-${numericIncrementId}`;

        const newBook = new Book({
            bookId,
            title,
            authors,
            description,
            price,
        });

        await newBook.save();

        // sending email to all user's about the new book.
        const users = await User.find();
        for (const user of users) {
            const emailData = {
                to: user.email,
                subject: 'New Book Release',
                text: `Dear ${user.username},\n\nA new book titled "${title}" by ${authors} has been released. Check it out now!`
            };

            await agenda.schedule('in a minute', 'send email', emailData);
        }

        res.status(201).json({ message: 'Book added successfully' });
    } catch (error) {
        if (error.code === 11000 && error.keyPattern && error.keyPattern.title) {
            return res.status(400).json({ message: 'Title must be unique' });
        } else {
            console.error('Error adding book:', error);
            res.status(500).json({ message: 'Failed to add book' });
        }
    }
};


// function for serching and filtering
export const search = async (req, res) => {
    try {
        const { title, author, minPrice, maxPrice } = req.query;

        const query = {};
        if (title) {
            query.title = { $regex: new RegExp(title, 'i') };
        }
        if (author) {
            query.authors = { $regex: new RegExp(author, 'i') };
        }
        if (minPrice !== undefined && maxPrice !== undefined) {
            query.price = { $gte: parseInt(minPrice), $lte: parseInt(maxPrice) };
        }

        const filteredBooks = await Book.find(query);

        res.json(filteredBooks);
    } catch (error) {
        console.error('Error searching books:', error);
        res.status(500).json({ message: 'Failed to search books' });
    }
}


// function for adding review and rating
export const addReview = async (req, res) => {
    const { userId, rating, comment } = req.body;
    const bookId = req.params.bookId;

    try {
        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        const existingReview = book.reviews.find(review => review.userId.toString() === userId);
        if (existingReview) {
            return res.status(400).json({ message: 'You have already reviewed this book' });
        }

        const review = { userId, rating, comment };
        book.reviews.push(review);
        await book.save();

        res.status(201).json({ message: 'Review added successfully' });
    } catch (error) {
        console.error('Error adding review:', error);
        res.status(500).json({ message: 'Failed to add review' });
    }
}

// function to get reviews for a book
export const viewReview = async (req, res) => {
    const bookId = req.params.bookId;

    try {
        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.json({ reviews: book.reviews });
    } catch (error) {
        console.error('Error fetching reviews:', error);
        res.status(500).json({ message: 'Failed to fetch reviews' });
    }
}