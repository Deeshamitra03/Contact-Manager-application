# 📘 Contact Management System 

A full-stack Relationship Management application built with the **PERN stack** (PostgreSQL, Express, React, Node.js). This application allows users to securely manage personal contacts with advanced features like tagging, notes, and priority sorting.

## 🚀 Features

- **User Authentication:** Secure registration and login using JWT (JSON Web Tokens) and Bcrypt encryption.
- **Smart Sorting:** "Favorite" contacts are pinned to the top; others are sorted alphabetically.
- **Rich Contact Data:** Store names, emails, validated 10-digit phone numbers, custom tags (e.g., "Work", "Family"), and detailed notes.
- **Favorites System:** Toggle contacts as favorites with a single click (★).
- **Data Validation:** strict validation on frontend and backend (e.g., phone numbers must be 10 digits).
- **Responsive UI:** Clean, mobile-friendly interface built with Bootstrap 5 and React Toastify.

## 🛠️ Tech Stack

- **Frontend:** React.js, React Router v6, Bootstrap 5
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL
- **Security:** Cors, Dotenv, JWT Authorization

## ⚙️ Local Setup Instructions

### Prerequisites
- Node.js installed
- PostgreSQL installed and running

### 1. Database Setup
Open your PostgreSQL terminal (psql) and run the following commands to set up the database and tables:

```sql
CREATE DATABASE contact_db;

-- Connect to database
\c contact_db

-- 1. Create Users Table
CREATE TABLE users (
    user_id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL
);

-- 2. Create Contacts Table (With support for Notes, Tags, and Favorites)
CREATE TABLE contacts (
    contact_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(user_id),
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    email VARCHAR(255),
    is_favorite BOOLEAN DEFAULT FALSE,
    notes TEXT,
    tags VARCHAR(255)
);

## API Endpoints

Method,Endpoint,Description
POST,/auth/register,Register a new user
POST,/auth/login,Login existing user
GET,/dashboard/contacts,Fetch all contacts (Sorted by Fav > A-Z)
POST,/dashboard/contacts,"Add a new contact (Requires Name, Phone, Email)"
PUT,/dashboard/contacts/favorite/:id,"Toggle ""Favorite"" status"
DELETE,/dashboard/contacts/:id,Delete a contact
