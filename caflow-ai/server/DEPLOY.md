# CAFlow AI Backend - Deployment Guide

## Quick Start (Local)

```bash
cd caflow-ai/server
npm install
npm start
```

Server will run on http://localhost:5000

---

## Free Deployment Options

### 1. Render.com (Recommended - Free Forever)

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your caflow-ai repo
5. Set:
   - **Root Directory:** `server`
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Add Environment Variable:
   - `JWT_SECRET` = `your-secret-key-here`
7. Click "Create Web Service"
8. Wait 2-3 minutes for deployment
9. Get your live URL like: `https://caflow-ai.onrender.com`

---

### 2. Railway.app (Free $5/month)

1. Go to https://railway.app
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub"
4. Select caflow-ai repo
5. Set root directory to `server`
6. Add environment variables
7. Deploy!

---

### 3. Fly.io (Free tier)

```bash
# Install fly CLI
npm install -g fly

# Login
fly auth login

# Deploy
cd server
fly launch
fly deploy
```

---

### 4. Glitch.com (Free - Easy)

1. Go to https://glitch.com
2. Create new project → "Import from GitHub"
3. Import caflow-ai repo
4. Edit package.json root to `server`
5. Done!

---

### 5. Vercel (For Frontend + Serverless)

Create `vercel.json`:
```json
{
  "version": 2,
  "builds": [
    { "src": "server/index.js", "use": "@vercel/node" }
  ],
  "routes": [
    { "src": "/api/(.*)", "dest": "/server/index.js" }
  ]
}
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get current user

### Clients
- `GET /api/clients` - List all clients
- `GET /api/clients/:id` - Get client details
- `POST /api/clients` - Create client
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Documents
- `GET /api/documents` - List documents
- `POST /api/documents` - Upload document
- `PUT /api/documents/:id` - Update document status

### Tasks
- `GET /api/tasks` - List tasks
- `POST /api/tasks` - Create task
- `PUT /api/tasks/:id` - Update task

### Reminders
- `GET /api/reminders` - List reminders
- `POST /api/reminders` - Schedule reminder

### Filings
- `GET /api/filings` - List filings
- `POST /api/filings` - Create filing
- `PUT /api/filings/:id` - Update filing

### Dashboard
- `GET /api/dashboard/stats` - Get dashboard statistics
- `GET /api/ai/suggestions` - Get AI suggestions

### Health
- `GET /api/health` - Check API status

---

## Default Login (Local)
- **Email:** admin@caflow.ai
- **Password:** admin123

---

## Frontend Configuration

Update your frontend API calls to use your deployed backend URL:

```javascript
// In your frontend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
```

For production, set `NEXT_PUBLIC_API_URL` to your deployed backend URL.

---

## Database

Uses SQLite (file-based, no setup needed):
- Local: `caflow.db` file created automatically
- Cloud: Database file created in project directory

To reset database, delete `caflow.db` and restart server. Demo data will be seeded automatically.

---

## Support

For issues, check:
1. Server logs
2. API health: `/api/health`
3. Database file exists: `server/caflow.db`