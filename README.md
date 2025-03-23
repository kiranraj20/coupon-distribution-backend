# Round-Robin Coupon Distribution with Admin Panel

![Project Status](https://img.shields.io/badge/status-completed-green.svg)
![Node.js](https://img.shields.io/badge/Node.js-v16+-blue.svg)
![React](https://img.shields.io/badge/React-v18+-blue.svg)
![MongoDB](https://img.shields.io/badge/MongoDB-v6+-green.svg)

A full-stack web application that distributes coupons to guest users in a round-robin manner, with an admin panel for managing coupons and preventing abuse. Built with **React** (frontend) and **Node.js/Express** (backend), using **MongoDB** as the database.

## Table of Contents
- [Features](#features)
- [Setup Instructions](#setup-instructions)
- [Implementation Overview](#implementation-overview)
- [Technologies](#technologies)
- [Live Deployment](#live-deployment)
- [Admin Credentials](#admin-credentials)
- [License](#license)

## Features
- **Coupon Distribution**: Assigns coupons sequentially to users without repetition.
- **Guest User Access**: No login required for claiming coupons.
- **Abuse Prevention**: IP and cookie-based tracking with a 1-minute cooldown.
- **User Feedback**: Displays success or restriction messages.
- **Admin Panel**:
  - Secure login with JWT and refresh tokens.
  - View all coupons (available and claimed) with pagination.
  - Add, update, toggle, and delete coupons.
  - View user claim history with pagination.
- **Real-Time Updates**: Polling updates the admin panel every 5 seconds.

## Setup Instructions

### Prerequisites
- **Node.js**: v16.x or higher
- **MongoDB**: Local instance or cloud (e.g., MongoDB Atlas)
- **Git**: Optional for cloning

### Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/<your-username>/coupon-distribution.git
   cd coupon-distribution

2. **Install Backend Dependencies**:
   cd server
   npm install

3. **Install Frontend Dependencies**:
   cd ../client
   npm install
4. **Configure Environment Variables**:
      • *Create a .env file in server/*:
         PORT=5000
         MONGO_URI=<your-mongodb-connection-string>
      JWT_SECRET=<your-secret-key>
      • *Example*:
         MONGO_URI=mongodb+srv://user:password@cluster.mongodb.net/coupon?retryWrites=true&w=majority
         JWT_SECRET=mysecretkey123
5. **Run the Backend**:
   cd server
   node server.js
   Should log: Server running on port 5000 and MongoDB Connected Successfully.
6. **Run the Frontend**:
   cd ../client
   npm start
   Opens http://localhost:3000 in your browser.
7. **Access the App**:
   User: http://localhost:3000/ to claim coupons.
   Admin: http://localhost:3000/login → Log in → http://localhost:3000/admin.

Implementation Overview
This project implements a coupon distribution system with an admin interface:

Coupon Distribution:
Backend: Uses MongoDB (Coupon model) to store coupons. The /api/claim endpoint assigns the next unclaimed, active coupon in sequence.
Frontend: UserCoupon.js fetches and displays coupons via Axios.
Abuse Prevention:
Middleware (abusePrevention.js) tracks claims by IP and cookie, enforcing a 1-minute cooldown using the Claim model.
Admin Panel:
Authentication: JWT access tokens (15m expiry) and refresh tokens stored in session storage. Auto-authenticates if tokens are valid.
Endpoints:
GET /api/admin/coupons: Paginated coupon list.
POST /api/admin/coupons: Add coupon.
PUT /api/admin/coupons/:id: Update/toggle coupon.
DELETE /api/admin/coupons/:id: Delete unclaimed coupons.
GET /api/admin/claims: Paginated claim history.
Frontend: AdminPanel.js manages state with React hooks, polls data every 5s, and includes pagination (5 items/page).
Pagination: Backend uses skip and limit; frontend adds "Previous" and "Next" buttons.
Technologies
Frontend: React, React Router, Axios, Session Storage, jwt-decode
Backend: Node.js, Express, MongoDB (Mongoose), JWT, cookie-parser, CORS, uuid
Structure:
coupon-distribution/
├── client/         # React frontend
├── server/         # Node.js backend
├── .gitignore
└── README.md