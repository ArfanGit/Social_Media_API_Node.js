# Account & Auth API - NestJS + Fastify + Prisma

A TypeScript/Node.js backend API focused on **user accounts**, **authentication**, and **self-service account management** (profile update, password change, soft delete), built with **NestJS**, **Fastify**, and **Prisma**.  
Additional modules for posts and voting are included as optional examples and can be enabled if needed.

## 🚀 Features

- **User Management**: User registration, profile retrieval, profile update
- **Authentication**: JWT-based authentication system
- **Password Management**: Strong password rules, change password endpoint
- **Account Deletion**: Soft delete with password confirmation
- **Posts** (optional): CRUD operations for posts with pagination and search
- **Voting System** (optional): Like/unlike posts functionality
- **API Documentation**: Interactive Swagger/OpenAPI documentation
- **Database**: PostgreSQL with Prisma ORM
- **Docker Support**: Complete Docker setup for easy development

## 🛠️ Tech Stack

- **Framework**: NestJS 11 (with Fastify adapter)
- **Language**: TypeScript 5.9
- **ORM**: Prisma 6.19
- **Database**: PostgreSQL 16
- **Authentication**: JWT (Passport.js)
- **Validation**: class-validator, class-transformer
- **Documentation**: Swagger/OpenAPI
- **Password Hashing**: bcrypt

## 📋 Prerequisites

- **Node.js** 20+ and npm
- **Docker** and **Docker Compose** (for containerized setup)
- **PostgreSQL** 16+ (if running locally without Docker)

## 🚀 Quick Start

### Option 1: Docker (Recommended)

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Account_&_Auth_API
   ```

2. **Start the application**
   ```bash
   docker-compose -f docker-compose-dev.yml up --build
   ```

   This will:
   - Build the NestJS application
   - Start PostgreSQL database
   - Run database migrations
   - Start the API server with hot-reload

3. **Access the API**
   - API: http://localhost:8002
   - Swagger Docs: http://localhost:8002/api/docs

### Option 2: Local Development

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=postgresql://postgres:password123@localhost:5432/fastify_crud
   JWT_SECRET=your-secret-key-change-in-production-09d25e094faa6ca2556c818166b7a9563b93f7099f6f0f4caa6cf63b88e8d3e7
   ACCESS_TOKEN_EXPIRE_MINUTES=30
   ```

3. **Set up the database**
   ```bash
   # Generate Prisma Client
   npx prisma generate

   # Run migrations
   npx prisma migrate dev
   ```

4. **Start the development server**
   ```bash
   npm run start:dev
   ```

   The API will be available at http://localhost:8002

## 📚 API Endpoints

### Authentication
- `POST /login` - Login and get JWT token
  - Body: `{ "email": "user@example.com", "password": "password123" }`
  - Returns: `{ "access_token": "...", "token_type": "bearer" }`

### Users
- `POST /users` - Create a new user
  - Body: `{ "email": "user@example.com", "password": "password123" }`
- `GET /users/:id` - Get user by ID
- `GET /users/me` - Get current user profile (requires authentication)

### Posts
- `POST /posts` - Create a new post (requires authentication)
  - Body: `{ "title": "Post Title", "content": "Post content...", "published": true }`
- `GET /posts` - Get all posts with pagination and search (requires authentication)
  - Query params: `?limit=10&skip=0&search=keyword`
- `GET /posts/:id` - Get post by ID with vote count (requires authentication)
- `PUT /posts/:id` - Update a post (requires authentication, owner only)
- `DELETE /posts/:id` - Delete a post (requires authentication, owner only)

### Votes
- `POST /vote` - Vote on a post (requires authentication)
  - Body: `{ "post_id": 1, "dir": 1 }` (dir: 1 = like, 0 = unlike)

### Health
- `GET /` - Health check endpoint

## 🔐 Authentication

All protected endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

To authenticate:
1. Create a user via `POST /users`
2. Login via `POST /login` to get a JWT token
3. Use the token in subsequent requests

## 📁 Project Structure

```
CRUD-Fastify/
├── src/
│   ├── auth/              # Authentication module
│   │   ├── decorators/    # CurrentUser decorator
│   │   ├── dto/           # Login DTOs
│   │   ├── guards/        # JWT auth guard
│   │   └── strategies/    # JWT strategy
│   ├── users/             # Users module
│   │   └── dto/           # User DTOs
│   ├── posts/             # Posts module
│   │   └── dto/           # Post DTOs
│   ├── votes/             # Votes module
│   │   └── dto/           # Vote DTOs
│   ├── prisma/            # Prisma service
│   ├── app.module.ts     # Root module
│   └── main.ts            # Application entry point
├── prisma/
│   ├── schema.prisma      # Database schema
│   └── migrations/        # Database migrations
├── docker-compose-dev.yml # Docker Compose config
├── Dockerfile             # Docker image definition
└── package.json           # Dependencies and scripts
```

## 🗄️ Database Schema

The application uses three main models:

- **User**: id, email, password, createdAt
- **Post**: id, title, content, published, createdAt, ownerId
- **Vote**: Composite key (userId, postId) for user-post votes

## 🔧 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | Required |
| `JWT_SECRET` | Secret key for JWT signing | Required |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | JWT token expiration time | 30 |

## 📝 Available Scripts

- `npm run build` - Build the TypeScript project
- `npm run start` - Start the production server
- `npm run start:dev` - Start the development server with hot-reload
- `npm test` - Run tests (when implemented)

## 🧪 Testing the API

### Using Swagger UI

1. Navigate to http://localhost:8001/api/docs
2. Click "Authorize" and enter your JWT token
3. Try out the endpoints directly from the browser

### Using cURL

```bash
# Create a user
curl -X POST http://localhost:8001/users \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Login
curl -X POST http://localhost:8001/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'

# Create a post (replace TOKEN with actual JWT)
curl -X POST http://localhost:8001/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TOKEN" \
  -d '{"title":"My First Post","content":"This is my post content","published":true}'
```

## 🐳 Docker Commands

```bash
# Start services
docker-compose -f docker-compose-dev.yml up

# Start in background
docker-compose -f docker-compose-dev.yml up -d

# Stop services
docker-compose -f docker-compose-dev.yml down

# View logs
docker-compose -f docker-compose-dev.yml logs -f api

# Rebuild after changes
docker-compose -f docker-compose-dev.yml up --build
```

## 📦 Database Migrations

```bash
# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations
npx prisma migrate deploy

# Reset database (development only)
npx prisma migrate reset
```

## 🔄 Project Conversion Notes

This project was converted from a FastAPI (Python) course project to NestJS/TypeScript. Key conversions:

- **FastAPI → NestJS**: Framework conversion with similar routing patterns
- **SQLAlchemy → Prisma**: ORM conversion with type-safe queries
- **Pydantic → class-validator**: Schema validation conversion
- **Python dependencies → TypeScript decorators**: Dependency injection patterns
- **FastAPI Depends → NestJS Guards/Decorators**: Authentication patterns

All endpoints maintain the same functionality and behavior as the original FastAPI implementation.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Original FastAPI course project structure
- NestJS documentation and community
- Prisma team for excellent ORM tooling

---

**Note**: This is a development/learning project. For production use, ensure:
- Strong JWT secrets
- Proper environment variable management
- Database connection pooling
- Rate limiting
- Input validation and sanitization
- Error handling and logging
- Security best practices
