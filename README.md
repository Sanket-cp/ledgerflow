# LedgerFlow

A comprehensive ledger and accounting management system for small businesses.

## Features

- Customer management with credit tracking
- Transaction recording (given/taken)
- Inventory management
- Sales and expense tracking
- Interest calculation
- Reports and analytics
- Activity logging
- Multi-language support
- Dark/Light theme

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite
- Tailwind CSS
- shadcn-ui components
- React Router
- React Query
- Framer Motion

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- Bcrypt for password hashing

## Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or cloud)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <YOUR_GIT_URL>
cd ledger-magic-main
```

2. Install frontend dependencies:
```bash
npm install
```

3. Install backend dependencies:
```bash
cd backend
npm install
```

4. Configure environment variables:
```bash
cd backend
cp .env.example .env
# Edit .env with your configuration
```

5. Start MongoDB (if running locally)

6. Start the backend server:
```bash
cd backend
npm run dev
```

7. Start the frontend (in a new terminal):
```bash
npm run dev
```

The frontend will run on `http://localhost:8080` and backend on `http://localhost:5000`

## Project Structure

```
ledger-magic-main/
├── backend/              # Backend API
│   ├── src/
│   │   ├── config/      # Database config
│   │   ├── controllers/ # Route controllers
│   │   ├── middleware/  # Auth & error handling
│   │   ├── models/      # Mongoose models
│   │   ├── routes/      # API routes
│   │   └── server.js    # Entry point
│   └── package.json
├── src/                  # Frontend source
│   ├── components/      # React components
│   ├── context/         # Context providers
│   ├── pages/           # Page components
│   ├── types/           # TypeScript types
│   └── lib/             # Utilities
└── package.json
```

## API Documentation

See [backend/README.md](backend/README.md) for detailed API documentation.

## Development

- Frontend dev server: `npm run dev`
- Backend dev server: `cd backend && npm run dev`
- Build frontend: `npm run build`
- Run tests: `npm test`

## License

MIT
