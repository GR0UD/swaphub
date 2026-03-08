# 🚀 Vercel Deployment Guide

This guide explains how to deploy SwapHub to Vercel. The project consists of two separate deployments:

1. **Frontend (Next.js)** → Deploy to Vercel
2. **Backend (Express API)** → Deploy to Railway, Render, or similar service

---

## 📋 Prerequisites

- GitHub account connected to Vercel
- Vercel CLI (optional): `npm i -g vercel`
- Backend hosting service account (Railway, Render, Heroku, etc.)

---

## 🎯 Option 1: Deploy Frontend to Vercel (Recommended for Quick Start)

### Step 1: Push to GitHub

```bash
git push origin main
```

Your code is already pushed to: https://github.com/GR0UD/swaphub

### Step 2: Connect to Vercel

1. Go to [vercel.com/dashboard](https://vercel.com/dashboard)
2. Click "Add New..." → "Project"
3. Import the GitHub repository: `GR0UD/swaphub`
4. Click "Import"

### Step 3: Configure Project Settings

In the Vercel dashboard:

1. **Root Directory**: Leave blank (Vercel will auto-detect)
2. **Framework Preset**: Next.js
3. **Build Command**: `npm --prefix projekt run build`
4. **Output Directory**: `projekt/.next`
5. **Install Command**: `npm --prefix projekt install`

### Step 4: Add Environment Variables

In Vercel dashboard → Project Settings → Environment Variables:

```
NEXT_PUBLIC_API_URL = https://your-api-domain.com
```

Where `https://your-api-domain.com` is your deployed backend API URL (see Option 2 below).

### Step 5: Deploy

Click "Deploy" button. Your frontend will be live! 🎉

---

## 🚀 Option 2: Deploy Backend to Railway (Best for Full-Stack)

### Step 1: Create Railway Account

1. Go to [railway.app](https://railway.app)
2. Sign up with GitHub
3. Create a new project

### Step 2: Connect GitHub Repository

1. In Railway dashboard, click "New Project"
2. Select "Deploy from GitHub repo"
3. Choose `GR0UD/swaphub`
4. Authorize Railway to access GitHub

### Step 3: Configure Build Settings

In Railway project:

1. **Root Directory**: `api`
2. **Build Command**: `npm install`
3. **Start Command**: `npm start`
4. **Runtime**: Node.js

### Step 4: Add Environment Variables

In Railway → Variables:

```
NODE_ENV = production
JWT_SECRET = your_super_secret_key_min_32_chars
CORS_ORIGIN = https://your-frontend.vercel.app
```

### Step 5: Deploy

Railway auto-deploys on git push.

### Step 6: Get API URL

1. In Railway dashboard, go to project settings
2. Find your service URL (e.g., `https://swaphub-api-prod.railway.app`)
3. Use this URL as `NEXT_PUBLIC_API_URL` in Vercel frontend settings

---

## 🌐 Alternative Backend Hosting Options

### Render.com

1. Go to [render.com](https://render.com)
2. Create account
3. New → Web Service
4. Connect GitHub repo
5. Set runtime to Node.js
6. Build command: `npm install`
7. Start command: `npm start`

### Heroku (Deprecated but still available)

1. Go to [heroku.com](https://heroku.com)
2. Create new app
3. Connect to GitHub
4. Deploy main branch
5. Set environment variables

### AWS Elastic Beanstalk

1. More complex setup but very scalable
2. Refer to AWS documentation

---

## 🔄 Connecting Frontend to Backend

After deploying backend:

1. Get your backend API URL (e.g., `https://swaphub-api.railway.app`)
2. Go to Vercel project settings
3. Update `NEXT_PUBLIC_API_URL` environment variable to your backend URL
4. Redeploy frontend

```bash
# Frontend will now use your production backend
NEXT_PUBLIC_API_URL=https://swaphub-api.railway.app
```

---

## 🔒 Database for Production

### Current: SQLite

SQLite works for small projects but not ideal for production.

### Better Options:

1. **PostgreSQL** (recommended)
   - Railway provides free PostgreSQL
   - Update `DATABASE_URL` in environment variables

2. **MongoDB**
   - No SQL database needed
   - Requires model changes

### To use PostgreSQL on Railway:

1. In Railway dashboard, add PostgreSQL service
2. Copy connection string
3. Set `DATABASE_URL` environment variable
4. Update `api/config/database.js` to use PostgreSQL

---

## ✅ Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Vercel project created and connected
- [ ] Railway project created for backend (or alternative)
- [ ] Environment variables configured on both services
- [ ] `NEXT_PUBLIC_API_URL` points to deployed API
- [ ] Frontend redeploy after backend URL is set
- [ ] Test API endpoints from production frontend
- [ ] Images upload and display correctly
- [ ] User authentication works
- [ ] Forms validate and submit successfully

---

## 🐛 Troubleshooting

### "Cannot connect to API"

```
Error: Failed to fetch http://localhost:4000
```

- [ ] Check `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- [ ] Verify backend is running and accessible
- [ ] Check CORS settings in API
- [ ] Look at browser DevTools → Network tab

### "CORS Error"

```
Access to XMLHttpRequest blocked by CORS policy
```

In `api/app.js`, update CORS:
```javascript
const cors = require('cors');
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
```

### "Images not loading"

- [ ] Verify `next.config.mjs` has correct remote pattern for API domain
- [ ] Check that `file-bucket` route is accessible on backend
- [ ] Ensure database has asset URLs

### "Build fails on Vercel"

1. Check build logs in Vercel dashboard
2. Run build locally: `npm --prefix projekt run build`
3. Check for TypeScript/syntax errors
4. Ensure all dependencies are installed

---

## 📊 Monitoring & Logs

### Vercel
- Dashboard: Check deployment logs
- Analytics: Monitor performance
- Functions: API logs if applicable

### Railway
- Dashboard: View logs in real-time
- Metrics: CPU, Memory, Network usage
- History: View past deployments

---

## 🔐 Security Checklist

- [ ] JWT_SECRET is unique and long (min 32 characters)
- [ ] Never commit `.env` files
- [ ] Use environment variables for all secrets
- [ ] Enable HTTPS (automatic on Vercel/Railway)
- [ ] Validate all user inputs
- [ ] Set CORS_ORIGIN to production domain only
- [ ] Use secure cookies for tokens (HttpOnly flag)

---

## 📚 Useful Links

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Express Production Best Practices](https://expressjs.com/en/advanced/best-practice-performance.html)

---

**Happy Deploying! 🚀**
