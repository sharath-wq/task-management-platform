# Task Management Application - Frontend

This is the frontend for the Task Management Application, providing a user-friendly interface to interact with the backend API.

## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **Vite**: A fast build tool that provides a lightning-fast development experience.
- **TypeScript**: For type-safe JavaScript development.
- **Redux Toolkit**: For efficient state management.
- **React Router DOM**: For declarative routing in React applications.
- **Axios**: Promise-based HTTP client for making API requests.
- **Chart.js & React-Chartjs-2**: For creating interactive charts in the analytics dashboard.
- **CSS**: For styling the application.

## Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [npm](https://www.npmjs.com/)

### Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    ```
2.  **Navigate to the frontend directory:**
    ```bash
    cd task-management-platform/frontend
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```

## How to Run the Application

### Development Mode

To run the application in development mode:

```bash
npm run dev
```

This will start the Vite development server, usually on `http://localhost:5173`.

### Building for Production

To build the application for production:

```bash
npm run build
```

This command compiles the TypeScript code and bundles the assets into the `dist` directory.

### Previewing the Production Build

To preview the production build locally:

```bash
npm run preview
```

## Features

-   **User Authentication**: Register, login, and manage user sessions.
-   **Task Management**: Create, read, update, and delete tasks.
-   **Task Filtering and Sorting**: Filter tasks by status, priority, and search by keywords. Sort tasks by various criteria.
-   **Task Details**: View detailed information about a task, including comments and attachments.
-   **Comments**: Add, edit, and delete comments on tasks.
-   **File Attachments**: Upload, view, download, and delete files associated with tasks.
-   **Analytics Dashboard**: Visualize task statistics and trends.

## Architecture Decisions

-   **React with Vite**: Chosen for its component-based architecture, efficient rendering, and fast development server, providing a smooth developer experience.
-   **TypeScript**: Integrated for static type checking, enhancing code quality, maintainability, and reducing runtime errors.
-   **Component-Based Structure**: The UI is organized into reusable and modular components (`components/` and `pages/`), promoting reusability and easier management of complex UIs.
-   **Redux Toolkit**: Utilized for centralized state management, particularly for authentication (`authSlice.ts`), ensuring predictable state updates and easier debugging.
-   **Axios with Interceptors**: Used for all HTTP requests to the backend. An Axios interceptor automatically attaches the authentication token to outgoing requests, simplifying API calls and centralizing token management.
-   **React Router DOM**: Manages client-side routing, enabling navigation between different views without full page reloads.
-   **Styling**: A combination of plain CSS files (e.g., `home.css`, `login.css`) and inline styles are used for styling, following a modular approach where styles are co-located with their respective components or pages.
