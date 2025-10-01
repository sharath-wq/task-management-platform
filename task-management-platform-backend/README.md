# Task Management Application - Backend

This is the backend for the Task Management Application, providing a RESTful API for managing tasks, users, comments, and file attachments.

## Technologies Used

- **Node.js**: JavaScript runtime environment.
- **Express.js**: Web application framework for Node.js.
- **TypeScript**: Superset of JavaScript that adds static typing.
- **MongoDB**: NoSQL database for storing application data.
- **Mongoose**: ODM library for MongoDB and Node.js.
- **JWT (JSON Web Tokens)**: For securing API endpoints.
- **Winston & Pino**: For application logging.
- **Express-Validator**: For request validation.
- **Multer**: For handling file uploads.
- **Docker**: For containerization.

## Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/try/download/community) running on `localhost:27017`.

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```
2.  **Navigate to the backend directory:**
    ```bash
    cd task-management-platform/backend
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Set up environment variables:**
    Create a `.env.dev` file in the `backend` directory and add the necessary environment variables.

## Environment Variables

Create a `.env.dev` file in the root of the `backend` directory and populate it with the following variables:

```env
JWT_TOKEN=your_super_secret_jwt_token
NODE_ENV=development
CLIENT_URL=http://localhost:5173
MONGO_URI=mongodb://localhost:27017/task_management
```

- `JWT_TOKEN`: A secret key for signing JSON Web Tokens.
- `NODE_ENV`: The application environment (e.g., `development`, `production`).
- `CLIENT_URL`: The URL of the frontend application for CORS configuration.
- `MONGO_URI`: The connection string for your MongoDB database.

## How to Run the Application

### Development Mode

To run the application in development mode with hot-reloading:

```bash
npm run dev
```

The server will start on port 3000.

### Production Mode

1.  **Build the TypeScript source:**
    ```bash
    npm run build
    ```
2.  **Start the application using PM2:**
    ```bash
    npm start
    ```

### Stopping the Application

To stop the PM2 process:

```bash
npm run stop
```

## API Endpoints

The base path for all API endpoints is `/api/v1`.

- `GET /health`: Health check endpoint.
- `/auth`: User authentication (register, login, me).
- `/users`: Get user information.
- `/tasks`: CRUD operations for tasks.
- `/comments`: CRUD operations for comments on tasks.
- `/files`: File upload, download, and deletion for tasks.
- `/analytics`: Endpoints for task analytics and data export.

## Architecture Decisions

- **Layered Architecture**: The codebase is structured into distinct layers (`routes`, `controllers`, `services`, `models`) to separate concerns, making the application easier to maintain and scale.
- **TypeScript**: Used throughout the project to enforce type safety, which helps catch errors early and improves the developer experience with better autocompletion and code navigation.
- **Centralized Error Handling**: A custom error handling middleware is used to catch and process errors consistently across the application, sending formatted error responses to the client.
- **JWT for Authentication**: Stateless authentication is implemented using JSON Web Tokens. A middleware protects secure endpoints by verifying the token from the `Authorization` header.
