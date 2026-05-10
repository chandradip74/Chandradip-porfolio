# Fullstack Portfolio Project (MERN)

This is a complete, production-ready portfolio project consisting of a Frontend (Vite + React), an Admin Panel (Vite + React), and a Backend (Node.js + Express + MongoDB).

## Folder Structure

- `/frontend` - The main portfolio website visible to users.
- `/adminPanel` - The CMS for managing portfolio content.
- `/backend` - The RESTful API that serves both applications.

## Prerequisites

- Node.js (v18+)
- MongoDB Atlas cluster
- Cloudinary account

## Environment Setup

You need to create the following environment files based on the provided examples.

### 1. Backend (`/backend/.env`)

Create a `.env` file in the `/backend` directory:
```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_super_secret_jwt_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-admin.vercel.app
```

### 2. Frontend (`/frontend/.env.local` & `/frontend/.env.production`)

For local development (`.env.local`):
```env
VITE_API_URL=http://localhost:5000/api
```

For production (`.env.production`):
```env
VITE_API_URL=https://your-backend-url.onrender.com/api
```

### 3. Admin Panel (`/adminPanel/.env.local` & `/adminPanel/.env.production`)

Same as the frontend, configure your API URLs for local and production.

## Running Locally

1. **Backend**:
   ```bash
   cd backend
   npm install
   npm run dev
   ```
2. **Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```
3. **Admin Panel**:
   ```bash
   cd adminPanel
   npm install
   npm run dev
   ```

## Deployment Guide

### 1. Backend (Render / Railway / Heroku)

- Connect your GitHub repository to your hosting provider.
- Set the **Root Directory** to `backend`.
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- Add all variables from your `.env` to the provider's Environment Variables settings.

### 2. Frontend & Admin Panel (Vercel)

The `vercel.json` configurations are already included in both directories to handle SPA routing.

1. Go to Vercel and Import your GitHub repository.
2. **For Frontend:**
   - Framework Preset: Vite
   - Root Directory: `frontend`
   - Build Command: `npm run build`
   - Environment Variables: Add `VITE_API_URL` pointing to your deployed backend.
3. **For Admin Panel:**
   - Framework Preset: Vite
   - Root Directory: `adminPanel`
   - Build Command: `npm run build`
   - Environment Variables: Add `VITE_API_URL` pointing to your deployed backend.

## Security & Optimizations Implemented

- **Security Headers**: Helmet integration on the backend.
- **Rate Limiting**: Express-rate-limit prevents brute force attacks.
- **NoSQL Injection Protection**: express-mongo-sanitize.
- **XSS Protection**: React handles this automatically, and HPP prevents HTTP parameter pollution.
- **File Upload Limits & Optimizations**: Handled via Multer and Cloudinary configurations.
- **Axios Interceptors**: Used for global error handling and authentication token injection.
- **Code Splitting**: Vite configurations optimized to chunk vendor libraries.
