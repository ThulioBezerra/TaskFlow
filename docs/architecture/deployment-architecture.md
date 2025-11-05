# Deployment Architecture

## Deployment Strategy
For the MVP, deployment is **local only**. The application is not intended to be hosted on the cloud.

**Frontend Deployment:**
- **Platform:** N/A (Local dev server)
- **Build Command:** `npm run build`
- **Output Directory:** `frontend/dist`

**Backend Deployment:**
- **Platform:** N/A (Local machine)
- **Build Command:** `mvn clean package`
- **Deployment Method:** Run the generated JAR file: `java -jar target/taskflow-0.0.1-SNAPSHOT.jar`

## CI/CD Pipeline
N/A for MVP.

## Environments
| Environment | Frontend URL | Backend URL | Purpose |
|---|---|---|---|
| Development | http://localhost:5173 | http://localhost:8080 | Local development |
