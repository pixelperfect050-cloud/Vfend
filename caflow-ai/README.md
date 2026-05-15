# CAFlow AI

**Smart Workflow for Modern Accountants** - AI-Powered CA Practice Management

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![Next.js](https://img.shields.io/badge/Next.js-16-black)
![React](https://img.shields.io/badge/React-19-blue)
![License](https://img.shields.io/badge/license-MIT-green)

---

## Features

- 🏠 **Smart Dashboard** - Real-time stats, charts, AI insights
- 👥 **Client Management** - Health scores, risk analysis
- 📄 **Document Collection** - Auto-categorization, status tracking
- 📱 **WhatsApp Reminders** - Hindi + English templates, smart escalation
- 🤖 **AI Features** - Risk score, notice explainer, quick reply
- ✅ **Task Management** - Kanban board, voice notes, priority tracking
- 💬 **WhatsApp-style Chat** - Client communication
- 📊 **Analytics** - Revenue, filings, staff performance
- 🌐 **Client Portal** - Simple UI for clients
- 🌙 **Dark/Light Mode** - Theme support
- 📱 **Mobile-first** - Responsive design
- 🔐 **Role-based Auth** - Admin, Staff, Client

---

## Quick Start

### 1. Frontend (Next.js)

```bash
# Navigate to project
cd caflow-ai

# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build
```

Frontend runs at: http://localhost:3000

### 2. Backend (Express + SQLite)

```bash
# Navigate to server
cd caflow-ai/server

# Install dependencies
npm install

# Run server
npm start
```

Backend runs at: http://localhost:5000

---

## Default Login

- **Email:** admin@caflow.ai
- **Password:** admin123

---

## Pages

| Page | URL | Description |
|------|-----|-------------|
| Landing | `/` | Marketing page |
| Dashboard | `/dashboard` | Main admin dashboard |
| Clients | `/clients` | Client management |
| Documents | `/documents` | Document collection |
| Reminders | `/reminders` | WhatsApp reminder system |
| Tasks | `/tasks` | Kanban task board |
| Chat | `/chat` | WhatsApp-style chat |
| Analytics | `/analytics` | Reports & charts |
| Client Portal | `/client-portal` | Simple client interface |
| Login | `/login` | Authentication |

---

## Tech Stack

- **Frontend:** Next.js 16, React 19, TypeScript
- **Styling:** Tailwind CSS 4, Framer Motion
- **Charts:** Recharts
- **Backend:** Express.js, SQLite, JWT
- **Icons:** Lucide React

---

## Deployment

### Frontend (Vercel - Recommended)

```bash
npm install -g vercel
vercel
```

### Backend Options

1. **Render.com** - Free, recommended
2. **Railway.app** - $5/month free tier
3. **Fly.io** - Free tier
4. **Glitch.com** - Free, easy setup

See `server/DEPLOY.md` for detailed deployment instructions.

---

## Project Structure

```
caflow-ai/
├── src/
│   ├── app/                 # Next.js pages
│   │   ├── dashboard/
│   │   ├── clients/
│   │   ├── documents/
│   │   ├── tasks/
│   │   ├── chat/
│   │   ├── analytics/
│   │   ├── reminders/
│   │   ├── client-portal/
│   │   └── login/
│   ├── components/         # React components
│   │   ├── ui/             # Base components
│   │   ├── dashboard/
│   │   ├── clients/
│   │   ├── tasks/
│   │   ├── ai/
│   │   └── layout/
│   ├── contexts/           # React contexts
│   ├── hooks/              # Custom hooks
│   ├── lib/                # Utilities
│   └── types/              # TypeScript types
├── server/                  # Backend
│   ├── index.js            # Express server
│   ├── package.json
│   └── DEPLOY.md           # Deployment guide
└── public/                  # Static files
```

---

## Environment Variables

### Frontend (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

### Backend (.env)
```
PORT=5000
JWT_SECRET=your-secret-key-here
```

---

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Current user

### Clients
- `GET /api/clients` - List
- `GET /api/clients/:id` - Details
- `POST /api/clients` - Create
- `PUT /api/clients/:id` - Update
- `DELETE /api/clients/:id` - Delete

### Documents, Tasks, Reminders, Filings, Payments
- Standard CRUD operations

### Dashboard
- `GET /api/dashboard/stats` - Stats
- `GET /api/ai/suggestions` - AI suggestions

---

## Demo Data

On first run, the server seeds demo data:
- 1 Admin user
- 3 Demo clients
- Sample tasks and documents

---

## License

MIT License - Free to use for personal and commercial projects.

---

## Support

For issues or questions, create an issue on GitHub.

**Built with ❤️ for CAs and Accountants**