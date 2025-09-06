# Expense Tracker - Backend

This is the backend of the Expense Tracker application, built with **Node.js**, **Express**, and **MongoDB**.
It provides RESTful APIs for authentication, expense management, and trends/summary analytics.
The backend is deployed on **Render**.

## Live Demo

Link => https://expense-tracker-server-mwa5.onrender.com

## Features

- User authentication with JWT & bcrypt (Login & Register)
- Expense CRUD (Create, Read, Update, Delete)
- Expense summary & trends API
- Protected routes with middleware
- MongoDB integration with Mongoose

## Tech Stack

- Node.js
- Express.js
- MongoDB + Mongoose
- JWT for authentication
- bcrypt.js for password hashing
- dotenv for environment variables

## Getting Started

1. Clone the repository

   ```bash
   git clone https://github.com/siva001v/Expense-Tracker-Server.git
   cd expense-tracker-server

   ```

2. Install dependencies

   ```bash
   npm install

   ```

3. Set up environment variables

   Create a .env file in the root directory:

   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret

4. Run the server

   ```bash
   npm start

   ```

## Project Structure

expense-tracker-backend/
│── src/
│ ├── routes/ # API routes (auth, expenses)
│ ├── controllers/ # Route handlers
│ ├── models/ # Mongoose schemas
│ ├── util/ # Helper functions (auth, logger)
│ ├── app.js # Server entry point
│── .env # Environment variables
│── package.json
│── README.md

## API Endpoints

1. Auth

POST /api/auth/register → Register user
POST /api/auth/login → Login & get JWT

2. Expenses

GET /api/expenses → Get all user expenses
POST /api/expenses → Add new expense
PUT /api/expenses/:id → Update expense
DELETE /api/expenses/:id → Delete expense
GET /api/expenses/:id → Get expense by id

3. Trends & Summary

GET /api/expenses/trends → Expense trends over time
GET /api/expenses/summary → Summary by category

4. User

GET /api/user → Get user
PUT /api/user/:id → Update user
PUT /api/user/change-password → Update password
