import nodemailer from 'nodemailer';
import User from '../models/Users.js';

// Function to send email notification to authors
export async function sendPurchaseNotificationToAuthors(purchase) {
    try {

        const authorUsernames = purchase.book.authors;

        const authors = await User.find({ username: { $in: authorUsernames } });

        // Extract the email addresses of the authors
        const authorEmails = authors.map(author => author.email);

        const emailContent = `Dear Author,\n\nA new purchase has been made for your book "${purchase.book.title}".\n\nDetails:\n- Quantity: ${purchase.quantity}\n- Total Amount: ${purchase.book.price}\n\nThank you for your contribution.\n\nRegards,\nThe Book Store Team`;

        // Create a Nodemailer transporter with SMTP configuration
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.USER_EMAIL,
                pass: process.env.PASSWORD
            }
        });

        // Compose email message
        const mailOptions = {
            from: process.env.USER_EMAIL,
            to: authorEmails.join(','), 
            subject: 'New Purchase Notification',
            text: emailContent
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log('Email sent:', info.response);
    } catch (error) {
        console.error('Error sending purchase notification:', error);
    }
}