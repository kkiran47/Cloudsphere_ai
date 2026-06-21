# CloudSphere AI

An Enterprise-Grade, AI-Powered Cloud Storage Platform.

## Features
- **Semantic Search**: Find files using natural language (powered by Gemini Embeddings & MongoDB Vector Search).
- **Chat with Files**: Ask questions about your documents using a LangChain RAG pipeline.
- **Auto Categorization**: AI automatically sorts your files on upload.
- **OCR Intelligence**: Extract text from images and scanned PDFs using Tesseract.js.
- **Secure Storage**: Cloudinary integration for scalable file storage.
- **Real-time**: Socket.io powered notifications.
- **Admin Dashboard**: Comprehensive system insights.

## Tech Stack
- **Frontend**: React.js, Tailwind CSS, Vite, Framer Motion, Axios.
- **Backend**: Node.js, Express.js, Socket.io.
- **Database**: MongoDB Atlas.
- **AI**: Google Gemini API, LangChain.

## Setup Instructions

1. **Clone the repository**
2. **Install dependencies**
   - Backend: `cd backend && npm install`
   - Frontend: `cd frontend && npm install`
3. **Environment Variables**
   - Create a `.env` file in the `backend` directory based on `.env.example`.
   - Provide your MongoDB URI, Cloudinary keys, and Gemini API key.
4. **Run the Application**
   - Backend: `cd backend && npm run dev`
   - Frontend: `cd frontend && npm run dev`

## Deployment
This project is configured to deploy directly to Render using the included `render.yaml` file.
