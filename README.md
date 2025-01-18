Alx software engineering graduation project

# Cafe Ordering App

A full-stack application built for seamless cafe ordering experiences. This app allows users to browse menu items, place orders, and manage accounts, offering dynamic functionality with a mobile-first approach.

---

## Features

### User Features
- Browse menu items with detailed descriptions.
- Add/remove items to/from the cart.
- Place orders and track order status.
- Save favorite menu items for quick reordering.
- Reset password functionality with email verification.

### Admin Features
- Manage menu items (add, edit, delete).
- View and process orders.

---

## Tech Stack

### Frontend:
- **Framework:** React Native
- **Styling:** Nativewind (Tailwind)
- **State Management:** Context API

### Backend:
- **Framework:** Express.js
- **Database:** MongoDB
- **Authentication:** JSON Web Tokens (JWT)
- **Email Service:** NodeMailer


---

## Setup Instructions

### Prerequisites
- **Node.js** (v16 or later)
- **MongoDB** (local or cloud-based)
- **Git**

### Installation Steps

1. Clone the repository:
   ```
   git clone https://github.com/moutazmahmoud/notime.git
   cd notime
   ```

2. Install dependencies for both frontend and backend:
   ```bash
   cd client
   yarn install
   cd ../server
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the `backend` directory.
   - Add the following variables:
     ```env
     PORT=4000
     MONGO_URI=<your-mongodb-uri>
     JWT_SECRET=<your-jwt-secret>
     ```

4. Start the application:
   - Backend:
     ```bash
     cd backend
     npm run dev
     ```
   - Frontend:
     ```bash
     cd frontend
     yarn start
     ```

5. Open the app:
   - Mobile simulator or connected device for the frontend.

---

