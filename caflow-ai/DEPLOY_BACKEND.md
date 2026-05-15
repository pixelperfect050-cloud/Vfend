# CAFlow AI - Backend Deployment Guide

## Live Frontend URL:
**https://caflow-ai.vercel.app**

---

## Backend Deployment Options (All FREE)

### Option 1: Railway.app (Recommended - Easiest)

1. Go to https://railway.app
2. Sign in with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your `caflow-ai` repo
5. Set **Root Directory** = `server`
6. Click **Deploy**
7. Wait 2-3 minutes
8. Get your URL like: `https://caflow-ai.railway.app`

**Environment Variables (if needed):**
- `PORT` = `5000`
- `JWT_SECRET` = `your-secret-key`

---

### Option 2: Render.com

1. Go to https://render.com
2. Sign in with GitHub
3. Click "New" → "Web Service"
4. Connect GitHub repo
5. Settings:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Add Environment Variable:
   - `JWT_SECRET` = `caflow-secret-2024`
7. Click "Create Web Service"
8. Wait 2-3 minutes
9. Get URL like: `https://caflow-api.onrender.com`

---

### Option 3: Vercel (Same as frontend)

Create `vercel.json` in server folder and deploy:

```bash
cd caflow-ai/server
vercel --prod
```

---

## After Backend Deployment:

Update frontend to connect with backend:

1. Create `.env.local` in `caflow-ai/`:
```
NEXT_PUBLIC_API_URL=https://your-backend-url.railway.app
```

2. Redeploy frontend:
```bash
cd caflow-ai
vercel --prod
```

---

## Default Login (After backend setup)
- **Email:** admin@caflow.ai
- **Password:** admin123

---

## API Testing

Test your deployed backend:
```
GET https://your-backend-url/api/health
```

Should return:
```json
{
  "status": "ok",
  "message": "CAFlow AI API is running"
}
```

---

## Quick Test (Local Backend)

Run backend locally:
```bash
cd caflow-ai/server
npm start
```

Then test:
```
POST http://localhost:5000/api/auth/login
Body: {
  "email": "admin@caflow.ai",
  "password": "admin123"
}
```

---

## Need Help?

1. Railway: https://docs.railway.app
2. Render: https://render.com/docs
3. Vercel: https://vercel.com/docs

---

## Current Status

✅ Frontend Deployed: https://caflow-ai.vercel.app
⏳ Backend: Deploy using Railway/Render above

Once backend is deployed, update frontend `.env.local` and redeploy!