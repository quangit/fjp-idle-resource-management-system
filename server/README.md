# FJP-IRMS Backend API

Backend API server for FJP Idle Resource Management System.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- MongoDB 6+

### Installation

1. Install dependencies:
```bash
cd server
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/fjp-irms
JWT_SECRET=your-secret-key
FRONTEND_URL=http://localhost:5173
```

4. Create upload directories:
```bash
mkdir -p uploads/cvs
```

5. Seed database with sample data:
```bash
npm run seed
```

6. Start development server:
```bash
npm run dev
```

Server will run on `http://localhost:5000`

## 📚 API Documentation

### Authentication

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password"
}
```

Response:
```json
{
  "success": true,
  "token": "jwt-token-here",
  "user": {
    "id": "user-id",
    "username": "admin",
    "email": "admin@fjp.com",
    "role": "Admin",
    "status": "Active"
  }
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer {token}
```

### Users

#### Get All Users
```http
GET /api/users?page=1&limit=10&search=admin&role=Admin&status=Active
Authorization: Bearer {token}
```

#### Create User
```http
POST /api/users
Authorization: Bearer {token}
Content-Type: application/json

{
  "username": "newuser",
  "email": "user@fjp.com",
  "password": "password",
  "role": "Viewer"
}
```

#### Update User
```http
PUT /api/users/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "role": "Manager",
  "status": "Active"
}
```

#### Delete User
```http
DELETE /api/users/:id
Authorization: Bearer {token}
```

### Resources

#### Get All Resources
```http
GET /api/resources?page=1&limit=10&search=john&department=IT&status=Available&skills=React,Node.js&urgent=true
Authorization: Bearer {token}
```

#### Get Single Resource
```http
GET /api/resources/:id
Authorization: Bearer {token}
```

#### Create Resource
```http
POST /api/resources
Authorization: Bearer {token}
Content-Type: application/json

{
  "employeeCode": "FJP1234",
  "name": "John Doe",
  "email": "john@fjp.com",
  "phone": "0123456789",
  "department": "IT",
  "jobTitle": "Senior Developer",
  "skills": ["React", "Node.js", "MongoDB"],
  "experience": "5 years",
  "rate": 600,
  "idleFrom": "2024-01-01"
}
```

#### Update Resource
```http
PUT /api/resources/:id
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "Assigned",
  "rate": 650
}
```

#### Upload CV
```http
POST /api/resources/:id/cv
Authorization: Bearer {token}
Content-Type: multipart/form-data

cv: [file]
```

#### Delete Resource
```http
DELETE /api/resources/:id
Authorization: Bearer {token}
```

### History

#### Get All History
```http
GET /api/history?page=1&limit=20&action=UPDATE&userId=user-id&startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer {token}
```

#### Get Resource History
```http
GET /api/history/resource/:id
Authorization: Bearer {token}
```

### Reports

#### Get Overview Statistics
```http
GET /api/reports/overview
Authorization: Bearer {token}
```

Response:
```json
{
  "success": true,
  "stats": {
    "totalIdle": 125,
    "urgent": 45,
    "available": 80,
    "assigned": 30,
    "avgIdleDuration": "2.3"
  }
}
```

#### Get Department Statistics
```http
GET /api/reports/department
Authorization: Bearer {token}
```

#### Get Skills Statistics
```http
GET /api/reports/skills
Authorization: Bearer {token}
```

#### Get Trend Data
```http
GET /api/reports/trends?months=6
Authorization: Bearer {token}
```

#### Export Report
```http
POST /api/reports/export
Authorization: Bearer {token}
Content-Type: application/json

{
  "format": "pdf",
  "type": "overview"
}
```

## 🔐 Role-Based Access Control

| Endpoint | Admin | RA | Manager | Viewer |
|----------|-------|----|---------| -------|
| GET /api/users | ✅ | ✅ | ✅ | ❌ |
| POST /api/users | ✅ | ❌ | ❌ | ❌ |
| PUT /api/users/:id | ✅ | ❌ | ❌ | ❌ |
| DELETE /api/users/:id | ✅ | ❌ | ❌ | ❌ |
| GET /api/resources | ✅ | ✅ | ✅ | ✅ |
| POST /api/resources | ✅ | ✅ | ❌ | ❌ |
| PUT /api/resources/:id | ✅ | ✅ | ❌ | ❌ |
| DELETE /api/resources/:id | ✅ | ❌ | ❌ | ❌ |
| GET /api/history | ✅ | ✅ | ✅ | ❌ |
| GET /api/reports/* | ✅ | ✅ | ✅ | ✅ |
| POST /api/reports/export | ✅ | ✅ | ✅ | ❌ |

## 🧪 Test Accounts

After running seed script:

- **Admin**: `admin` / `password`
- **RA**: `ra001` / `password`
- **Manager**: `mgr_hr` / `password`
- **Viewer**: `viewer01` / `password`

## 📁 Project Structure

```
server/
├── controllers/       # Request handlers
├── models/           # Mongoose schemas
├── routes/           # API routes
├── middleware/       # Custom middleware
├── scripts/          # Utility scripts
├── uploads/          # File uploads
├── .env.example      # Environment template
├── server.js         # Entry point
└── package.json
```

## 🛠️ Development

```bash
# Install dependencies
npm install

# Run in development mode with auto-reload
npm run dev

# Seed database
npm run seed

# Start production server
npm start
```

## 🔒 Security Features

- JWT authentication
- Password hashing with bcrypt
- Role-based authorization
- Rate limiting
- Helmet security headers
- CORS protection
- Input validation
- File upload restrictions

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| NODE_ENV | Environment | development |
| MONGODB_URI | MongoDB connection string | mongodb://localhost:27017/fjp-irms |
| JWT_SECRET | JWT signing secret | - |
| JWT_EXPIRE | JWT expiration time | 7d |
| FRONTEND_URL | Frontend URL for CORS | http://localhost:5173 |
| MAX_FILE_SIZE | Max upload file size | 5242880 (5MB) |

## 🐛 Troubleshooting

### MongoDB Connection Error
```bash
# Make sure MongoDB is running
mongod --dbpath /path/to/data
```

### Port Already in Use
```bash
# Change PORT in .env file
PORT=5001
```

### JWT Token Invalid
- Check JWT_SECRET matches between requests
- Token may have expired (default 7 days)
- Re-login to get new token

## 📄 License

MIT
