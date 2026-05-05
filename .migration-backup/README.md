# Smart Hire (Job Picker)

A full-stack web application designed to connect employers with job seekers. It features role-based access, email OTP verification, and a modern React frontend with a secure Node.js backend.

## Features

- **Role-Based Authentication**: Separate portals for Job Seekers and Employers.
- **Secure Registration**: Integration with Nodemailer for OTP email verification.
- **Job Management**: Employers can post, edit, and track job applications.
- **Application Tracking**: Job seekers can view the status of their applications.
- **RESTful API**: Built with Node.js, Express, and secured using JWT.
- **Database**: MongoDB with Mongoose providing data validation and modeling.

## Tech Stack

### Frontend
- React.js (v19)
- React Router dom
- Axios

### Backend
- Node.js & Express.js
- MongoDB & Mongoose
- JSON Web Token (JWT)
- Bcryptjs for password hashing
- Nodemailer for email services

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account (or local MongoDB)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Nishan109/jobsPicker.git
   cd jobsPicker
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   * Configure environment variables: Rename `.env.example` to `.env` and fill in your MongoDB URI and Gmail App credentials.
   ```bash
   npm start
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   npm start
   ```

The frontend will run on `http://localhost:3000` and the backend on `http://localhost:5000`.

## Security Features
- **Rate Limiting**: Custom OTP service implements rate limiting for login and registration requests.
- **Environment Securing**: `.env` is ignored by Git to ensure database and email credentials remain private.
- **Account Lock**: Brute force protection locks the user's account after maximum login attempts fail.

## License
MIT
