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

#**SmartDev AI Assistant** is a high-end, full-stack developer workspace designed to streamline technical workflows. It provides a premium, "Neural OS" inspired environment where developers can:

- 💬 **Neural Chat**: Consult an intelligent AI assistant with full-width, markdown-supported conversations.
- 🚀 **Integrated Playground**: Write and execute code (JS, TS, Python, etc.) in a real-time Monaco-based editor.
- 📝 **Artifact Vault**: Automatically save AI-generated code snippets and technical insights into a persistent notes system.
- ↔️ **Adaptive UI**: Customize your workflow with a resizable, draggable sidebar and glassmorphic design.
- ⌨️ **Power-User Shortcuts**: Navigate instantly with global hotkeys like `Ctrl + L`.
- 📊 **Compute Tracking**: Monitor high-speed inference usage powered by Groq's LLM engine.

---

## ✨ Features

### 🤖 Neural AI Assistant
- **Context-Aware Conversations**: Advanced state management for deep technical debugging.
- **Markdown & Code Support**: Full syntax highlighting for technical responses.
- **Rapid Inference**: Powered by **Groq Llama-3-70b** for near-zero latency.
- **Artifact Transmission**: Save technical snippets directly to your dev notes.

### 🎮 Technical Playground
- **Monaco Editor**: A VS Code-like editing experience with IntelliSense and custom themes.
- **Multi-Language Support**: Execute or simulate JavaScript, TypeScript, Python, CSS, and HTML.
- **System Console**: Intercept and display real-time console output in a dedicated terminal UI.
- **Node Status**: Live visual indicators of compiler cycles and sandbox health.

### ↔️ Adaptive Layout
- **Resizable Sidebar**: Draggable width adjustment for a personalized workspace layout.
- **Fluid UI**: Smooth 60fps animations powered by Framer Motion.
- **Quick Navigation**: `Ctrl + L` global shortcut to instantly summon the AI Assistant from anywhere.

### 📝 Dev Vault (Notes)
- **Knowledge Capture**: Structured note-taking for architectural patterns and snippets.
- **Search & Filter**: Find your past technical solutions indexed across your history.
- **Persistent Memory**: Seamless synchronization between AI insights and your local note library.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: [Next.js 16.1](https://nextjs.org/) (App Router & Turbopack)
- **Code Editor**: [@monaco-editor/react](https://github.com/suren-atoyan/monaco-react)
- **Styling**: [Tailwind CSS 4.x](https://tailwindcss.com/)
- **Animations**: [Framer Motion 12](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **State**: React Hooks (useState, useEffect, useCallback)

### Backend
- **Engine**: [Node.js](https://nodejs.org/) & [Express 5.x](https://expressjs.com/)
- **Database**: [MongoDB](https://www.mongodb.com/) & [Mongoose](https://mongoosejs.com/)
- **AI Inference**: [Groq SDK](https://groq.com/) (Meta Llama 3)
- **Security**: JWT Authentication, Bcrypt Hashing, & Express Rate Limiting

---

## 📁 Project Structure

```
ai-dev-assistance/
├── client/                      # Next.js Frontend (Neural App)
│   ├── app/
│   │   ├── dashboard/           
│   │   │   ├── ai/              # Neural AI Assistant (Chat)
│   │   │   ├── playground/      # Technical Playground (Monaco Editor)
│   │   │   ├── notes/           # Dev Vault (Notes System)
│   │   │   └── layout.tsx       # Adaptive Sidebar & Keyboard Hooks
│   ├── components/              # Premium Design System
│   └── lib/                     # API & Service Layers
│
├── server/                      # Express Backend (Compute Engine)
│   ├── controllers/             # Logic Handlers
│   ├── services/                # Groq AI Integration
│   └── models/                  # Mongo Data Schemas
```

---

## 🚀 Installation

### Prerequisites
- **Node.js** (v18+)
- **MongoDB**
- **Groq API Key** ([Get it here](https://console.groq.com/))

### Getting Started

1. **Clone & Install**
   ```bash
   git clone https://github.com/yourusername/ai-dev-assistance.git
   cd ai-dev-assistance
   cd server && npm install
   cd ../client && npm install
   ```

2. **Configure Environment**
   Set up your `.env` in the `server` folder with your `GROQ_API_KEY`, `MONGO_URI`, and `JWT_SECRET`.

3. **Initialize Workspace**
   ```bash
   # Terminal 1
   cd server && npm run dev
   
   # Terminal 2
   cd client && npm run dev
   ```

---

## ⌨️ Shortcuts
| Shortcut | Action |
| :--- | :--- |
| `Ctrl + L` | Open AI Assistant |
| `Ctrl + S` | Save Current Artifact |
| `Ctrl + /` | Toggle Sidebar (Planned) |

---
/keys](https://console.groq.com/keys)
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

