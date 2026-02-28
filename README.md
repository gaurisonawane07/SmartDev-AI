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

## 🎥 Demo

### Landing Page
Beautiful landing page with hero section, feature showcase, and call-to-action buttons.

### AI Chat Interface
Real-time AI chat with conversation history and beautiful message bubbles.

### Notes Dashboard
Organize your development notes with search, filters, and tags.

> **Note**: Add screenshots or GIFs of your application here

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
- **Groq API Key** ([Get it here](https://console.groq.com/))

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
GROQ_API_KEY=your_groq_api_key
NODE_ENV=development
```

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

## 🔐 Environment Variables

### Server (.env)

| Variable | Description | Required |
|----------|-------------|----------|
| `PORT` | Server port number | Yes |
| `MONGO_URI` | MongoDB connection string | Yes |
| `JWT_SECRET` | Secret key for JWT signing | Yes |
| `GROQ_API_KEY` | Groq API key for AI features | Yes |
| `NODE_ENV` | Environment (development/production) | No |

### Client (.env.local)

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_API_URL` | Backend API URL | Yes |

---

## 📡 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword"
}
```

**Response:**
```json
{
  "success": true,
  "token": "jwt_token_here",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "subscription": "free",
    "aiUsageCount": 0,
    "monthlyRequestLimit": 50
  }
}
```

### AI Chat Endpoints

#### Send Message to AI
```http
POST /api/ai/chat
Authorization: Bearer <token>
Content-Type: application/json

{
  "message": "How do I optimize React performance?",
  "conversationId": "optional_conversation_id"
}
```

**Response:**
```json
{
  "success": true,
  "data": "AI response here...",
  "conversationId": "conversation_id",
  "usage": 1,
  "remaining": 49
}
```

#### Save Response to Note
```http
POST /api/ai/save-note
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "React Performance Tips",
  "content": "AI response content..."
}
```

### Notes Endpoints

#### Get All Notes
```http
GET /api/notes
Authorization: Bearer <token>
```

#### Create Note
```http
POST /api/notes
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Note Title",
  "content": "Note content here..."
}
```

#### Update Note
```http
PUT /api/notes/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Title",
  "content": "Updated content..."
}
```

#### Delete Note
```http
DELETE /api/notes/:id
Authorization: Bearer <token>
```

### User Endpoints

#### Get User Profile
```http
GET /api/user/profile
Authorization: Bearer <token>
```

---

## 💡 Usage

### Getting Started

1. **Register an Account**: Navigate to `/register` and create your account
2. **Login**: Use your credentials at `/login`
3. **Dashboard**: Access the dashboard to see your AI usage statistics
4. **AI Chat**: Go to the AI section to start chatting with the assistant
5. **Create Notes**: Use the notes section to organize your knowledge base
6. **Save AI Responses**: Click save button in chat to store important responses

### AI Chat Tips

- Be specific in your questions for better responses
- Use conversation history for context-aware follow-ups
- Save important snippets to notes for future reference
- Monitor your usage to stay within limits

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

### Development Guidelines

- Follow the existing code style
- Write meaningful commit messages
- Add comments for complex logic
- Test your changes thoroughly
- Update documentation as needed

---

## 📝 License

This project is licensed under the **ISC License**.

---

## 🙏 Acknowledgments

- [Groq](https://groq.com/) for the blazing-fast AI inference
- [Vercel](https://vercel.com/) for Next.js framework
- [MongoDB](https://www.mongodb.com/) for database solution
- [Tailwind CSS](https://tailwindcss.com/) for styling utilities
- [Lucide](https://lucide.dev/) for beautiful icons

---

## 📧 Contact

For questions or support, please open an issue or contact the maintainer.

---

<div align="center">

**Built with ❤️ by developers, for developers**

⭐ Star this repo if you find it helpful!

</div>
