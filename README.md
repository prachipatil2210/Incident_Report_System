# Incident Reporting Application

A full-stack, secure web application designed for comprehensive incident reporting and management. This application features a visitor-facing form for submitting reports and a secure, protected dashboard for security personnel to analyze and manage incidents in real-time.

## Features

- **Public Incident Reporting Form**: A user-friendly interface allowing visitors to securely submit incident reports.
- **Secure Security Dashboard**: A protected area for administrators and security staff to view, manage, and analyze reported incidents.
- **Real-Time Data Visualization**: Interactive charts and data visualisations within the dashboard.
- **Robust Authentication**: Secure user login and signup system using JWT (JSON Web Tokens) to ensure sensitive data is only accessible to authorized personnel.

## Tech Stack

The application is split into a modular backend API and a modern frontend single-page application.

### Frontend
- **React.js**: Core frontend library.
- **Vite**: Fast frontend build tool and development server.
- **React Router**: For client-side routing and navigation.
- **Recharts**: For creating interactive data visualizations in the dashboard.
- **Lucide React**: For beautiful, consistent iconography.

### Backend
- **Node.js & Express.js**: Fast, minimalist web framework for building the API.
- **SQLite (sqlite3)**: Lightweight, file-based relational database for storing users and incident reports.
- **Bcrypt.js**: For secure password hashing.
- **JSON Web Tokens (JWT)**: For stateless, secure API authentication.
- **CORS**: Configured for secure cross-origin requests between frontend and backend.

## Project Structure

```text
.
├── backend/                  # Node.js Express API and Database
│   ├── database.sqlite       # SQLite Database File
│   ├── database.js           # Database initialization and connection logic
│   ├── server.js             # Main Express server and API routes
│   └── package.json          # Backend dependencies
│
└── frontend/                 # React Frontend Application
    ├── src/
    │   ├── pages/            # Page components (SignupPage, LoginPage, Dashboard, etc.)
    │   ├── App.jsx           # Main application routing
    │   └── ...
    ├── index.html            # Entry HTML file
    ├── vite.config.js        # Vite configuration
    └── package.json          # Frontend dependencies
```

## Setup and Installation

### Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher recommended)
- npm (comes with Node.js)

### 1. Clone the repository
Ensure you have the repository cloned or downloaded locally.

### 2. Setup the Backend
Navigate to the backend directory, install dependencies, and start the server.

```bash
cd backend
npm install
node server.js
```
The backend server will typically start on port 5000 (or the port specified in your code). It will automatically create the `database.sqlite` file if it doesn't exist.

### 3. Setup the Frontend
Open a new terminal window/tab, navigate to the frontend directory, install dependencies, and start the development server.

```bash
cd frontend
npm install
npm run dev
```
The frontend application will be served by Vite, typically accessible at `http://localhost:5173`.

## Environment Variables
*(If applicable)* You may need to create a `.env` file in the backend directory to specify your JWT secret or database connection strings. By default, the application runs with standard development configurations.

---
*Built with modern web technologies.*
