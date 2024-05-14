# Book Store Backend

## Overview

This project implements the backend for a book store application, focusing on user management, book management, purchase history, and revenue tracking for authors.

## Logic for Computing sellCount

The sellCount attribute of each book is computed dynamically based on the purchase history. Whenever a user purchases a book, the sellCount of that book is incremented by the quantity purchased. This ensures that the sellCount accurately reflects the number of times a book has been sold.

## Mechanism for Sending Email Notifications

Email notifications are sent using Nodemailer, a module for Node.js applications that allows sending email. 

### Purchase Notifications

When a user purchases a book, an email notification is sent to the author about the purchase.

### Revenue Notifications

Revenue notifications are sent to authors on a monthly basis using the node-cron module to schedule email sending at regular intervals. Each month, the system calculates the revenue generated from book sales for each author and sends an email containing revenue details, including the total revenue for the current month and year.

## Database Design and Implementation

### Users

The users collection in the database stores information about the users of the application. Each user has a unique identifier (_Id), username, email, and role.

### Books

The books collection stores information about the books available in the store. Each book has a unique identifier (bookId), title, authors, description, price, sellCount, and reviews.

### Purchase History

The purchaseHistory collection maintains records of book purchases made by users. Each purchase record includes a unique purchaseId, bookId, userId, purchaseDate, price, and quantity.

## Usage

1. Clone the repository: `git clone https://github.com/sibin12/Book_Store_Backend.git`
  
2. Setting up Environment Variables

Before running the application, you need to set up your environment variables. This can be done by creating a .env file at the root of the project directory. 

Inside the .env file, add the following variables:

* MONGO_URL
* PORT
* JWT_SECRET
* USER_EMAIL
* PASSWORD 

3. Install dependencies: `npm install`

4. Run the application: `npm start`

## Contributing

Contributions are welcome! If you have suggestions, feature requests, or bug reports, please open an issue or submit a pull request or connect me via email (sibinthekkel@gmail.com).


