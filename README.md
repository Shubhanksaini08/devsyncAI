# DevSync AI 🚀

**DevSync AI** is a state-of-the-art, AI-powered collaborative development environment built for modern software teams. It combines the power of real-time multiplayer coding with a context-aware AI pair programmer, all running directly in your browser.

## ✨ Key Features

- **🤖 AI Pair Programmer**: Integrated intelligent agent that understands your entire codebase, helping you generate features, debug errors, and refactor code instantly.
- **⚡ Browser-Based Runtime**: Powered by WebContainer API, execute Node.js servers, install NPM packages, and preview web applications without any local setup.
- **👥 Real-time Collaboration**: Native support for multiplayer coding. Invite teammates to your workspace for instant file syncing, shared terminals, and integrated chat.
- **🎨 Premium UI/UX**: Designed with a sleek, modern aesthetic featuring glassmorphism, dynamic animations, and both Light and Dark mode support.
- **🔐 Secure Authentication**: Full user management system with personalized profiles and secure session handling.

## 🛠️ Technology Stack

- **Frontend**: React, Vite, Tailwind CSS, Remix Icons.
- **Backend**: Node.js, Express, Socket.io, MongoDB, Redis.
- **AI Engine**: Google Gemini AI (Vertex AI / Google Generative AI).
- **Runtime**: @webcontainer/api for in-browser execution.

## 🚀 Getting Started

1. **Clone the repository**:
   ```bash
   git clone https://github.com/shubhanksaini08/devsync-ai.git
   ```
2. **Setup Backend**:
   - `cd backend`
   - Create a `.env` file with `MONGODB_URI`, `JWT_SECRET`, `REDIS_CREDENTIALS`, and `GOOGLE_AI_KEY`.
   - `npm install`
   - `npm run dev`
3. **Setup Frontend**:
   - `cd frontend`
   - Create a `.env` file with `VITE_API_URL`.
   - `npm install`
   - `npm run dev`

---
