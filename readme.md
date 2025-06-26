# 💰 Expense Tracker

A full-stack web application for managing personal expenses with a modern React frontend and Node.js backend.

## 🚀 Live Demo

[View Live Demo](https://manageyourexpense.vercel.app/) 

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Screenshots](#-screenshots)
- [Installation](#-installation)
- [Usage](#-usage)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Contributing](#-contributing)
- [License](#-license)

## ✨ Features

### 🔐 Authentication
- **User Registration & Login** - Secure JWT-based authentication
- **Protected Routes** - Automatic redirect to login for unauthenticated users
- **Profile Management** - View and manage user profile

### 💸 Expense Management
- **Add Expenses** - Create new expenses with detailed information
- **View All Expenses** - Comprehensive list with filtering and pagination
- **Edit & Delete** - Modify or remove existing expenses
- **Expense Categories** - Organize expenses by custom categories
- **Payment Sources** - Track expenses by payment method (Cash, Debit, Credit, Other)

### 📊 Analytics & Reports
- **Dashboard Overview** - Key metrics and statistics
- **Time-based Filtering** - View expenses by time periods (Current Month, Last 3 Months, Last 6 Months, Custom Range)
- **Category-wise Analysis** - Breakdown of expenses by category
- **Source-wise Analysis** - Payment method distribution
- **Date Range Statistics** - Custom date range analytics

### 🎨 User Interface
- **Modern Design** - Clean, responsive UI with Tailwind CSS
- **Mobile Responsive** - Works seamlessly on all devices
- **Real-time Updates** - Instant feedback and notifications
- **Loading States** - Smooth user experience with loading indicators
- **Toast Notifications** - Success and error messages

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern React with hooks and functional components
- **Vite** - Fast build tool and development server
- **React Router** - Client-side routing
- **Axios** - HTTP client for API calls
- **React Toastify** - Toast notifications
- **Tailwind CSS** - Utility-first CSS framework
- **Remix Icons** - Beautiful icon library

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcrypt** - Password hashing
- **Zod** - Schema validation
- **CORS** - Cross-origin resource sharing

### Development Tools
- **Git** - Version control
- **npm** - Package management



## 🚀 Installation

### Prerequisites

Before you begin, ensure you have the following installed:
- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [MongoDB](https://www.mongodb.com/try/download/community)

### Step 1: Clone the Repository

```bash
git clone https://github.com/goutamdz/expense-tracker.git
cd expense-tracker
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Configure Environment Variables:**

Edit the `.env` file in the backend directory:

```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/expense-tracker
JWT_SECRET=your-super-secret-jwt-key-here
NODE_ENV=development
```

**Start the Backend Server:**

```bash
# Development mode
npm run dev

# Production mode
npm start
```

The backend will be running on `http://localhost:3000`

### Step 3: Frontend Setup

```bash
# Open a new terminal and navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

**Configure Frontend Environment Variables:**

Edit the `.env` file in the frontend directory:

```env
VITE_BACKEND_BASE_URL=http://localhost:3000
```

**Start the Frontend Development Server:**

```bash
npm run dev
```

The frontend will be running on `http://localhost:5173`

### Step 4: Access the Application

Open your browser and navigate to `http://localhost:5173`

## 📖 Usage

### 1. **Registration & Login**
- Create a new account with your name, email, and password
- Login with your credentials
- JWT token is automatically stored and managed

### 2. **Adding Expenses**
- Click the "Add Expense" button on the dashboard
- Fill in the expense details:
  - Title
  - Amount
  - Date
  - Category (select from existing or create new)
  - Payment Source (Cash, Debit, Credit, Other)
  - Description (optional)
- Submit to save the expense

### 3. **Managing Categories**
- Navigate to "Add Categories" from the navbar menu
- Create custom categories for better organization
- View and delete existing categories
- Categories cannot be deleted if they have associated expenses

### 4. **Viewing Analytics**
- Dashboard shows key metrics and statistics
- Use time filters to view different periods
- View detailed expense list with filtering and sorting
- Export or share reports (coming soon)

### 5. **Filtering & Search**
- Filter expenses by category, payment source, or date range
- Sort expenses by date, amount, or title
- Pagination for large datasets
- Real-time search functionality

## 📚 API Documentation

For detailed API documentation, see the [Backend README](./backend/README.md)

### Quick API Overview:

- **Authentication**: `POST /api/v1/user/register`, `POST /api/v1/user/login`
- **Expenses**: `GET/POST/PUT/DELETE /api/v1/expense`
- **Categories**: `GET/POST/DELETE /api/v1/category`
- **Statistics**: `GET /api/v1/expense/stats`

## 📁 Project Structure

```
expense-tracker/
├── backend/                 # Backend API
│   ├── controllers/         # Route controllers
│   ├── models/             # Database models
│   ├── routes/             # API routes
│   ├── middleware/         # Custom middleware
│   ├── DB/                 # Database connection
│   ├── index.js            # Server entry point
│   └── README.md           # Backend documentation
├── frontend/               # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/          # Page components
│   │   ├── utils/          # Utility functions
│   │   ├── App.jsx         # Main app component
│   │   └── main.jsx        # Entry point
│   ├── public/             # Static assets
│   └── package.json        # Frontend dependencies
├── README.md               # This file
└── .gitignore             # Git ignore rules
```

## 🔧 Development

### Running in Development Mode

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```


## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
   ```bash
   git clone https://github.com/gautamdz/expense-tracker.git
   ```

2. **Create a feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the existing code style
   - Add tests for new features
   - Update documentation if needed

4. **Commit your changes**
   ```bash
   git commit -m "Add: your feature description"
   ```

5. **Push to the branch**
   ```bash
   git push origin feature/your-feature-name
   ```

6. **Create a Pull Request**

### Contribution Guidelines

- Write clear, descriptive commit messages
- Follow the existing code style and conventions
- Add tests for new functionality
- Update documentation for any API changes
- Ensure all tests pass before submitting

## 🐛 Issues

If you find a bug or have a feature request, please [open an issue](https://github.com/goutamdz/expense-tracker/issues) on GitHub.


## 🙏 Acknowledgments

- [React](https://reactjs.org/) - Frontend framework
- [Express.js](https://expressjs.com/) - Backend framework
- [MongoDB](https://www.mongodb.com/) - Database
- [Tailwind CSS](https://tailwindcss.com/) - CSS framework
- [Vite](https://vitejs.dev/) - Build tool

## 📞 Support

If you need help or have questions:

- 📧 Email: [goutamhzb1@gmail.com]
- 💬 visit on : [https://goutamkumardz.vercel.app]
- 🐛 Issues: [GitHub Issues](https://github.com/goutamdz/expense-tracker/issues)

---

⭐ **Star this repository if you found it helpful!**

Made with ❤️ by [Goutam](https://github.com/goutamdz)
