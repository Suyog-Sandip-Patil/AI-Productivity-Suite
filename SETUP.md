# 🚀 Mindful Day - Quick Setup Guide

This guide will help you get the Mindful Day application running on your local machine in just a few minutes.

## 📋 Prerequisites

Before you begin, make sure you have the following installed:
- **Node.js** (version 16 or higher) - [Download here](https://nodejs.org/)
- **npm** (comes with Node.js) or **yarn**
- A modern web browser (Chrome, Firefox, Safari, Edge)

## ⚡ Quick Start (Recommended)

### Option 1: Automated Setup
```bash
# 1. Navigate to the project directory
cd mindful-day

# 2. Run the automated setup (installs all dependencies)
npm run setup

# 3. Start both backend and frontend servers
npm run start-all
```

### Option 2: Manual Setup
```bash
# 1. Install backend dependencies
npm install

# 2. Install frontend dependencies
cd client
npm install
cd ..

# 3. Start backend server (Terminal 1)
npm run dev

# 4. Start frontend server (Terminal 2 - new terminal)
cd client
npm start
```

## 🌐 Access the Application

Once both servers are running:
- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000

## 🔧 Configuration

The application comes with sensible defaults, but you can customize:

### Environment Variables
Create a `.env` file in the root directory (already exists):
```env
JWT_SECRET=your_super_secret_jwt_key_here_change_in_production
PORT=5000
NODE_ENV=development
```

**Important**: Change the `JWT_SECRET` in production!

## 📱 First Steps

1. **Open your browser** to http://localhost:3000
2. **Create an account** using the beautiful signup form
3. **Explore the features**:
   - Add your first task in the Task Manager
   - Log your mood in the Mood Journal
   - Check out the animated Dashboard
   - Browse community quotes

## 🎨 Features to Try

### ✨ Animations
- Watch tasks bounce in when added
- See mood emojis morph when selected
- Enjoy the 3D quote carousel
- Toggle dark/light mode with smooth transitions

### 📊 Data Tracking
- Create tasks with different priorities
- Log daily moods with emojis and ratings
- View progress charts on the dashboard
- Share inspirational quotes

### 🔄 Real-time Updates
- Tasks update instantly when completed
- Dashboard refreshes automatically
- No page reloads needed

## 🛠️ Development Commands

```bash
# Backend only
npm run dev              # Start backend with nodemon

# Frontend only
cd client && npm start   # Start React development server

# Production build
npm run build           # Build React app for production

# Full setup
npm run setup          # Install all dependencies

# Start everything
npm run start-all      # Start both servers automatically
```

## 📁 Project Structure Overview

```
mindful-day/
├── client/           # React frontend
├── routes/           # API endpoints
├── middleware/       # Authentication
├── utils/           # Helper functions
├── data.json        # JSON database
├── server.js        # Express server
└── README.md        # Full documentation
```

## 🔍 Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Kill processes on ports 3000 and 5000
npx kill-port 3000 5000
```

**Dependencies not installing:**
```bash
# Clear npm cache
npm cache clean --force
# Delete node_modules and reinstall
rm -rf node_modules client/node_modules
npm run setup
```

**Backend not connecting:**
- Check if port 5000 is available
- Verify `.env` file exists
- Check console for error messages

**Frontend not loading:**
- Ensure React development server started successfully
- Check browser console for errors
- Verify all dependencies installed correctly

## 🎯 What's Included

### ✅ Complete Features
- ✅ User authentication with JWT
- ✅ Task management with priorities
- ✅ Mood journaling with emojis
- ✅ Interactive dashboard with charts
- ✅ Community quote sharing
- ✅ Dark/light mode toggle
- ✅ Responsive mobile design
- ✅ Beautiful animations throughout
- ✅ Real-time updates
- ✅ Toast notifications

### 🎨 UI/UX Highlights
- Glassmorphism design elements
- Smooth Framer Motion animations
- TailwindCSS responsive styling
- Intuitive navigation
- Loading states and feedback
- Form validation with animations

## 🚀 Ready to Go!

Your Mindful Day application is now ready! Start by creating an account and exploring all the beautiful, animated features designed to help you live more mindfully.

**Happy mindful living! 🧘‍♀️✨**

---

For detailed documentation, see the main [README.md](README.md) file.
