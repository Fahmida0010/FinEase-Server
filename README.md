# FinEase

**FinEase** is a personal finance management web application that helps users manage their income, expenses, and savings goals efficiently. It allows users to record transactions, set monthly budgets, and view insightful financial summaries with charts and reports.

This project demonstrates **CRUD operations**, **authentication**, **backend integration**, and **data visualization** — ideal for showcasing full-stack development skills.

---

# Project Overview

FinEase is designed to help individuals track and manage their personal finances in a simple and organized way. Users can record income and expense transactions, monitor their financial balance, and visualize spending patterns through interactive charts.

The platform provides secure authentication, private routes for personal financial data, and powerful data visualization tools to help users understand their financial habits and make better financial decisions.

---

# Live Links

* **Live Website:** https://cozy-sfogliatella-b1ff0b.netlify.app
* **Client Repository:** https://github.com/Fahmida0010/FinEase-client.git
* **Server Repository:** https://github.com/Fahmida0010/FinEase-Server.git

---

# Key Features

* **User Authentication:** Email/password & Google login via Firebase
* **Transaction Management (CRUD):** Add, update, delete, and view personal transactions
* **Reports with Charts:** Visualize income & expenses using Pie and Bar charts
* **Light/Dark Mode:** Switch between light and dark themes
* **SweetAlert Notifications:** Modern popups for success/error messages
* **Responsive Design:** Fully optimized for desktop, tablet, and mobile
* **Custom 404 Page:** Friendly “Not Found” page for invalid routes

---

# Main Pages & Functionalities

## Home Page

* Motivational **banner** section
* Overview of **total income, expense, and balance** (from database)
* Two static sections:

  * *Budgeting Tips*
  * *Why Financial Planning Matters*

---

## Authentication

* **Signup:** Name, Email, Password, PhotoURL
* **Login:** Email/Password & Google Login

Password validation rules:

* At least one uppercase and lowercase letter
* Minimum length: 6 characters

All messages shown via **SweetAlert** (no default alerts)

---

# Private Routes

Accessible only to logged-in users:

* `/add-transaction`
* `/my-transactions`
* `/transaction/:id`
* `/transaction/update/:id`
* `/reports`
* `/profile`

---

# Transaction Operations (CRUD)

## Add Transaction

* Fields: Type, Category, Amount, Description, Date, User Email & Name
* Stores data in MongoDB
* Shows success message after submission

## Update Transaction

* Pre-filled form with existing data
* Updates instantly after saving

## Delete Transaction

* SweetAlert confirmation before deletion
* Instantly updates UI after removing

## View Transaction Details

* Full details including Type, Category, Amount, and Date
* Displays total amount per category

---

# Reports Page

* Displays income & expense summary using **Recharts**
* Supports filtering by month
* Pie Chart (by category) and Bar Chart (monthly totals)

---

# My Profile

* Displays name, photo, and email
* Allows profile updates

---

# Main Technologies Used

## Frontend

* React (Vite)
* React Router
* Tailwind CSS
* SweetAlert2
* Recharts
* Firebase Authentication

## Backend

* Node.js
* Express.js
* MongoDB
* Firebase Admin SDK (Authorization)

---

# Dependencies Used

## Frontend Dependencies

* react
* react-router-dom
* firebase
* tailwindcss
* sweetalert2
* recharts
* axios

## Backend Dependencies

* express
* cors
* dotenv
* mongodb
* firebase-admin
* jsonwebtoken

---

# How to Run the Project Locally

## Step 1: Clone the Client Repository

```bash
git clone https://github.com/Fahmida0010/FinEase-client.git
```

## Step 2: Clone the Server Repository

```bash
git clone https://github.com/Fahmida0010/FinEase-Server.git
```

---

## Step 3: Navigate to the Client Folder

```bash
cd FinEase-client
```

---

## Step 4: Install Client Dependencies

```bash
npm install
```

---

## Step 5: Run the Client

```bash
npm run dev
```

Client will run on:

```
http://localhost:5173
```

---

# Setup and Run the Server

Open a new terminal and run:

## Step 6: Navigate to the Server Folder

```bash
cd FinEase-Server
```

---

## Step 7: Install Server Dependencies

```bash
npm install
```

---

## Step 8: Setup Environment Variables

Create a `.env` file and add:

```
MONGODB_URI=your_mongodb_connection_string
FIREBASE_ADMIN_KEY=your_firebase_admin_key
JWT_SECRET=your_secret_key
```

---

## Step 9: Run the Server

```bash
node index.js
```

Server will run on:

```
http://localhost:3000
```

---

# Relevant Links

**Live Site**
https://cozy-sfogliatella-b1ff0b.netlify.app

**Client Repository**
https://github.com/Fahmida0010/FinEase-client

**Server Repository**
https://github.com/Fahmida0010/FinEase-Server

---

# 🗄️ Database Example (MongoDB)

```json
{
  "type": "expense",
  "category": "home",
  "amount": 1000,
  "description": "house rent",
  "date": "2025-01-15T00:00:00.000Z",
  "email": "xyz@gmail.com",
  "name": "Hero"
}
```

