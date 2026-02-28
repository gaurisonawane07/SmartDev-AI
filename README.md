# 🚀 SmartDev AI Assistant

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-16.1.6-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.3-61DAFB?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-3178C6?style=for-the-badge&logo=typescript)
![Node.js](https://img.shields.io/badge/Node.js-Express-339933?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.x-38B2AC?style=for-the-badge&logo=tailwind-css)

**An intelligent developer workspace powered by AI to accelerate your development workflow**

[Features](#-features) • [Demo](#-demo) • [Installation](#-installation) • [Tech Stack](#-tech-stack) • [API Documentation](#-api-documentation) • [Contributing](#-contributing)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Features](#-features)
- [Demo](#-demo)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Installation](#-installation)
- [Environment Variables](#-environment-variables)
- [API Documentation](#-api-documentation)
- [Usage](#-usage)
- [Contributing](#-contributing)
- [License](#-license)

---

## 🔍 Overview

**SmartDev AI Assistant** is a full-stack SaaS platform designed for developers to streamline their workflow with AI-powered features. It provides an integrated environment where developers can:

- 💬 Chat with an intelligent AI assistant for code help and debugging
- 📝 Create and manage development notes and snippets
- 💾 Save AI responses directly to notes for future reference
- 🔒 Secure authentication with JWT
- 📊 Track AI usage with monthly request limits
- 🎨 Modern, responsive UI with smooth animations

The platform uses **Groq's lightning-fast LLM inference** with the GPT-OSS-120B model to provide near-instantaneous AI responses.

---

## ✨ Features

### 🤖 AI-Powered Chat
- **Context-Aware Conversations**: Maintains conversation history for contextual responses
- **Code Assistance**: Get help with debugging, optimization, and best practices
- **Fast Response Times**: Powered by Groq SDK for ultra-fast inference
- **Usage Tracking**: Monitor your AI request consumption

### 📝 Notes Management
- **Create & Organize**: Build your knowledge base with structured notes
- **Save AI Responses**: One-click save from AI conversations
- **Search & Filter**: Quickly find notes with advanced search
- **Tag System**: Organize notes with custom tags

### 🔐 Authentication & Security
- **JWT-based Authentication**: Secure token-based auth system
- **Password Encryption**: Bcrypt hashing for password security
- **Protected Routes**: Middleware-based route protection
- **Rate Limiting**: API rate limiting to prevent abuse

### 💎 Subscription Tiers
- **Free Tier**: 50 AI requests per month
- **Pro Tier**: Enhanced limits for power users
- **Usage Dashboard**: Real-time tracking of remaining requests

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first approach with Tailwind CSS 4
- **Smooth Animations**: Framer Motion for fluid interactions
- **Dark Mode**: Eye-friendly dark theme
- **Glass Morphism**: Modern glassmorphic design elements

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16.1.6](https://nextjs.org/) (App Router)
- **UI Library**: [React 19.2.3](https://react.dev/)
- **Language**: [TypeScript 5.x](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS 4.x](https://tailwindcss.com/)
- **Animations**: [Framer Motion 12.34.3](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **HTTP Client**: [Axios 1.13.5](https://axios-http.com/)

### Backend
- **Runtime**: [Node.js](https://nodejs.org/)
- **Framework**: [Express 5.2.1](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose 9.1.6](https://mongoosejs.com/)
- **Authentication**: [JWT](https://jwt.io/) + [bcryptjs](https://github.com/dcodeIO/bcrypt.js)
- **AI Integration**: [Groq SDK 0.37.0](https://console.groq.com/)
- **Security**: [CORS](https://github.com/expressjs/cors), [Express Rate Limit](https://github.com/express-rate-limit/express-rate-limit)
- **Environment**: [dotenv](https://github.com/motdotla/dotenv)

---

## 📁 Project Structure

```
ai-dev-assistance/
├── client/                      # Next.js frontend
│   ├── app/
│   │   ├── dashboard/           # Protected dashboard routes
│   │   │   ├── ai/              # AI chat interface
│   │   │   ├── notes/           # Notes management
│   │   │   ├── layout.tsx       # Dashboard layout with sidebar
│   │   │   └── page.tsx         # Dashboard home
│   │   ├── login/               # Login page
│   │   ├── register/            # Registration page
│   │   ├── globals.css          # Global styles
│   │   ├── layout.tsx           # Root layout
│   │   └── page.tsx             # Landing page
│   ├── components/              # Reusable React components
│   │   ├── AuthUI.tsx
│   │   ├── CTA.tsx
│   │   ├── FeatureGrid.tsx
│   │   ├── Footer.tsx
│   │   ├── Hero.tsx
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── TrustSection.tsx
│   ├── lib/
│   │   ├── api.ts               # API client configuration
│   │   └── utils.ts             # Utility functions
│   └── package.json
│
├── server/                      # Express backend
│   ├── config/
│   │   └── Db.js                # MongoDB connection config
│   ├── controllers/
│   │   ├── aiController.js      # AI chat logic
│   │   ├── authController.js    # Authentication logic
│   │   └── noteController.js    # Notes CRUD operations
│   ├── middlewares/
│   │   ├── authMiddleware.js    # JWT verification
│   │   ├── errorMiddleware.js   # Error handling
│   │   └── rateLimiter.js       # Rate limiting
│   ├── models/
│   │   ├── AIRequest.js         # AI conversation model
│   │   ├── note.model.js        # Note model
│   │   └── user.model.js        # User model
│   ├── routes/
│   │   ├── aiRoutes.js          # AI endpoints
│   │   ├── authRoutes.js        # Auth endpoints
│   │   ├── noteRoutes.js        # Notes endpoints
│   │   └── userRoutes.js        # User endpoints
│   ├── services/
│   │   └── ai.service.js        # Groq AI integration
│   ├── utils/
│   │   └── generateToken.js     # JWT token generation
│   ├── server.js                # Express app entry point
│   └── package.json
│
└── README.md
```

---

## 🚀 Installation

### Prerequisites
- **Node.js** (v18 or higher)
- **MongoDB** (local or Atlas)
- **Git**
- **Groq API Key** - Required for AI features ([Get it here](https://console.groq.com/))

### 🔑 Getting Your Groq API Key

1. Visit [Groq Console](https://console.groq.com/)
2. Sign up or log in to your account
3. Navigate to **API Keys** section
4. Click **Create API Key**
5. Copy your API key (keep it secure!)
6. Add it to your `.env` file as `GROQ_API_KEY`

> **Note**: Groq provides free tier access with generous limits. The platform offers ultra-fast inference speeds, making it perfect for real-time AI chat applications.

### Clone the Repository

```bash
git clone https://github.com/yourusername/ai-dev-assistance.git
cd ai-dev-assistance
```

### Backend Setup

```bash
cd server
npm install
```

Create a `.env` file in the `server` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key
GROQ_API_KEY=gsk_your_actual_groq_api_key_here
NODE_ENV=development
```

> **Important**: 
> - Get your Groq API key from [https://console.groq.com/keys](https://console.groq.com/keys)
> - Never commit your `.env` file to version control
> - The Groq API key starts with `gsk_`

Start the backend server:

```bash
npm run dev
```

The server will run on `http://localhost:5000`

### Frontend Setup

Open a new terminal:

```bash
cd client
npm install
```

Create a `.env.local` file in the `client` directory:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
```

Start the development server:

```bash
npm run dev
```

The client will run on `http://localhost:3000`

---

