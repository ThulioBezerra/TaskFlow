# Development Workflow

## Local Development Setup

### Prerequisites
```bash
# Install Java 17+ (e.g., via SDKMAN)
# Install Node.js 18+ and npm
# Install PostgreSQL 15+ and ensure it's running
```

### Initial Setup
```bash
# 1. Clone the repository
git clone <repo_url>
cd TaskFlow

# 2. Setup Backend
# - Create a database named 'taskflow' in PostgreSQL
# - Configure backend/src/main/resources/application.properties with DB credentials
cd backend
mvn install
cd ..

# 3. Setup Frontend
cd frontend
npm install
cd ..
```

### Development Commands
```bash
# Start backend (from root directory)
cd backend && mvn spring-boot:run

# Start frontend (from root directory, in a new terminal)
cd frontend && npm run dev

# Run backend tests
cd backend && mvn test

# Run frontend tests
cd frontend && npm test
```

## Environment Configuration

### Required Environment Variables
```bash
# Backend (backend/src/main/resources/application.properties)
spring.datasource.url=jdbc:postgresql://localhost:5432/taskflow
spring.datasource.username=your_db_user
spring.datasource.password=your_db_password
jwt.secret=a_very_strong_and_long_secret_key_for_jwt

# Frontend (.env.local in frontend directory)
VITE_API_BASE_URL=http://localhost:8080/api
```
