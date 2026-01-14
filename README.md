# Farmer Certification Portal

A full-stack application for managing farmer certification workflows with web and mobile farmer portals plus an admin dashboard.

## Tech Stack

- **Web Frontend**: Next.js 15+ (TypeScript, Tailwind CSS)
- **Mobile App**: React Native with Expo (TypeScript)
- **Backend**: Express.js (TypeScript)
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT-based
- **Containerization**: Docker & Docker Compose

## Project Structure

```
farmer-certification-portal/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── database.ts
│   │   │   └── env.ts
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts
│   │   │   ├── farmer.controller.ts
│   │   │   └── admin.controller.ts
│   │   ├── middleware/
│   │   │   ├── auth.middleware.ts
│   │   │   ├── error.middleware.ts
│   │   │   └── validation.middleware.ts
│   │   ├── routes/
│   │   │   ├── auth.routes.ts
│   │   │   ├── farmer.routes.ts
│   │   │   └── admin.routes.ts
│   │   ├── services/
│   │   │   ├── auth.service.ts
│   │   │   ├── farmer.service.ts
│   │   │   └── token.service.ts
│   │   ├── types/
│   │   │   ├── express.d.ts
│   │   │   └── index.ts
│   │   ├── utils/
│   │   │   ├── logger.ts
│   │   │   └── response.ts
│   │   └── server.ts
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── .env.example
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/page.tsx
│   │   │   │   └── register/page.tsx
│   │   │   ├── admin/
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── farmer/
│   │   │   │   ├── layout.tsx
│   │   │   │   └── page.tsx
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx
│   │   │   └── globals.css
│   │   ├── components/
│   │   │   ├── admin/
│   │   │   │   ├── FarmerList.tsx
│   │   │   │   └── CertificationActions.tsx
│   │   │   ├── farmer/
│   │   │   │   ├── StatusCard.tsx
│   │   │   │   └── RegistrationForm.tsx
│   │   │   ├── ui/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Card.tsx
│   │   │   │   ├── Input.tsx
│   │   │   │   ├── Select.tsx
│   │   │   │   └── StatusBadge.tsx
│   │   │   ├── Navbar.tsx
│   │   │   └── ThemeProvider.tsx
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   ├── auth.ts
│   │   │   ├── services.ts
│   │   │   └── utils.ts
│   │   ├── hooks/
│   │   │   ├── useAuth.ts
│   │   │   └── useFarmers.ts
│   │   └── types/
│   │       └── index.ts
│   ├── Dockerfile
│   ├── next.config.ts
│   ├── tailwind.config.ts
│   ├── package.json
│   └── tsconfig.json
├── mobile/
│   ├── app/
│   │   ├── _layout.tsx
│   │   ├── index.tsx
│   │   ├── login.tsx
│   │   ├── register.tsx
│   │   ├── farmer.tsx
│   │   └── admin.tsx
│   ├── src/
│   │   ├── components/
│   │   │   ├── Button.tsx
│   │   │   ├── Input.tsx
│   │   │   └── StatusBadge.tsx
│   │   ├── context/
│   │   │   └── AuthContext.tsx
│   │   ├── lib/
│   │   │   ├── api.ts
│   │   │   └── services.ts
│   │   ├── constants/
│   │   │   └── theme.ts
│   │   └── types/
│   │       └── index.ts
│   ├── app.json
│   ├── babel.config.js
│   ├── package.json
│   └── tsconfig.json
├── .github/
│   └── workflows/
│       └── ci-cd.yml
├── docker-compose.yml
└── README.md
```

## Quick Start

### Prerequisites

- Node.js 18+
- Docker & Docker Compose
- PostgreSQL (if running locally without Docker)

### Using Docker (Recommended)

```bash
# Clone the repository
git clone <repository-url>
cd farmer-certification-portal

# Start all services
docker-compose up --build

# Access the application
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
```

### Local Development

#### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your database credentials

# Run Prisma migrations
npx prisma migrate dev
npx prisma generate

# Seed the database (creates admin user)
npx prisma db seed

# Start development server
npm run dev
```

#### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local
# Edit .env.local with backend URL

# Start development server
npm run dev
```

## API Documentation

### Authentication Endpoints

#### Register Farmer

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "farmSize": 5.5,
  "cropType": "Maize"
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123"
}
```

### Farmer Endpoints

#### Get Own Status

```http
GET /api/farmers/me/status
Authorization: Bearer <token>
```

### Admin Endpoints

#### List All Farmers

```http
GET /api/admin/farmers
Authorization: Bearer <admin-token>
```

#### Update Farmer Status

```http
PATCH /api/admin/farmers/:id/status
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "status": "certified"
}
```

## Environment Variables

### Backend (.env)

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://user:password@localhost:5432/farmer_portal
JWT_SECRET=your-secret-key-change-in-production
JWT_EXPIRES_IN=7d
CORS_ORIGIN=http://localhost:3000
```

### Frontend (.env.local)

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```

## Default Credentials

After seeding the database:

**Admin Account**

- Email: admin@tradecare.com
- Password: admin123

## Database Schema

The application uses three main models:

- **User**: Authentication and user management
- **Farmer**: Farmer-specific data (linked to User)
- **Admin**: Admin-specific data (linked to User)

See `backend/prisma/schema.prisma` for complete schema.

## Features

### Farmer Portal

- Registration with farm details
- Login and authentication
- View certification status
- Dashboard with personal information

### Admin Portal

- View all registered farmers
- Certify or decline applications
- Filter and search farmers
- Bulk status updates

## Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## Deployment

### AWS Deployment

The application can be deployed to AWS using:

- **Frontend**: AWS Amplify or S3 + CloudFront
- **Backend**: EC2 or ECS
- **Database**: RDS PostgreSQL

Refer to deployment guides in respective directories.

### CI/CD

GitHub Actions workflow is configured for:

- Automated testing
- Docker image building
- Deployment to AWS

## Security Considerations

- JWT tokens for authentication
- Role-based access control (RBAC)
- Password hashing with bcrypt
- Input validation and sanitization
- CORS configuration
- Environment variable protection

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License

## Support

For issues or questions, please create an issue in the GitHub repository.
