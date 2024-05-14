import nodemailer from 'nodemailer';
import cron from 'node-cron';
import dotenv from 'dotenv';
import { calculateRevenue } from './calculateRevenue.js';
import User from '../models/Users.js';

dotenv.config();

export default async function sendRevenueEmailToAuthors() {
    try {
        // Calculate revenue for the current month
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();
        const revenueDetails = await calculateRevenue(currentMonth, currentYear);

        // Fetch authors' email addresses
        const authors = await getAuthors();

        // Compose email message
        const emailContent = composeEmail(revenueDetails);

        // Send email notifications to authors
        await sendEmailToAuthors(authors, emailContent);
    } catch (error) {
        console.error('Error sending revenue email:', error);
    }
}

async function getAuthors() {
    // Fetch authors' email addresses from the User collection
    const authors = await User.find({ role: 'author' });

    return authors.map(author => author.email);
}

function composeEmail(revenueDetails) {
    // Compose email content with revenue details
    return `
        <p>Dear Author,</p>
        <p>Here is your revenue report for ${revenueDetails.currentMonth}/${revenueDetails.currentYear}:</p>
        <p>Total Revenue: ${revenueDetails.totalRevenue}</p>
    `;
}

async function sendEmailToAuthors(authors, emailContent) {
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
        to: authors.join(','), 
        subject: 'Monthly Revenue Report',
        html: emailContent
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent:', info.response);
}

// Schedule revenue email notifications to be sent monthly
cron.schedule('0 0 1 * *', () => {
    console.log('Sending revenue email to authors...');
    sendRevenueEmailToAuthors();
}, {
    scheduled: true,
    timezone: 'Asia/Kolkata'
});
 