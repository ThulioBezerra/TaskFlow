# Unified Project Structure

```plaintext
TaskFlow/
├── backend/                    # Spring Boot application
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/
│   │   │   │       └── taskflow/
│   │   │   │           ├── config/         # Spring Security, WebSocket configurations
│   │   │   │           ├── controller/     # REST API endpoints
│   │   │   │           ├── dto/            # Data Transfer Objects for API
│   │   │   │           ├── exception/      # Custom exceptions and global handlers
│   │   │   │           ├── model/          # JPA Entities
│   │   │   │           ├── repository/     # Spring Data JPA repositories
│   │   │   │           ├── service/        # Business logic services
│   │   │   │           └── TaskflowApplication.java # Main Spring Boot app
│   │   │   └── resources/    # Application properties, static assets, templates
│   │   └── test/
│   │       └── java/
│   │           └── com/
│   │               └── taskflow/ # Unit and integration tests
│   └── pom.xml                 # Maven project file
├── frontend/                   # React/Vite application
│   ├── public/                 # Static assets not processed by Vite
│   ├── src/
│   │   ├── assets/             # Images, icons, fonts
│   │   ├── components/         # Reusable UI components
│   │   │   ├── common/         # Generic components (Button, Input, Modal)
│   │   │   └── layout/         # Layout components (Navbar, Sidebar)
│   │   ├── features/           # Feature-specific modules
│   │   │   ├── auth/           # Login, Register, authentication hooks
│   │   │   ├── projects/       # Project list, creation, settings
│   │   │   └── tasks/          # Kanban board, columns, cards, task details
│   │   ├── hooks/              # Global custom React hooks
│   │   ├── services/           # API client services (Axios setup)
│   │   ├── stores/             # Zustand state stores
│   │   ├── styles/             # Global styles, utility classes
│   │   ├── types/              # Shared TypeScript interfaces/types
│   │   ├── App.tsx             # Main application component
│   │   └── main.tsx            # Entry point for React application
│   └── package.json            # NPM project file
├── .gitignore
└── README.md
```
