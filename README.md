# ERP Demo Frontend

React + TypeScript frontend for the ERP Demo Backend API.

## Tech Stack

- **React** — UI framework
- **TypeScript** — type safety
- **Vite** — build tool & dev server
- **Bootstrap** — responsive CSS framework
- **React Bootstrap** — Bootstrap components for React
- **Bootstrap Icons** — icon library
- **React Router** — client-side routing
- **Axios** — HTTP client

## Project Structure

```
src/
├── api/            # Axios instance & interceptors
├── components/     # Shared UI components (ProtectedRoute, PermissionGuard, Navbar)
├── context/        # React Context providers (AuthContext)
├── pages/          # Page components (LoginPage, DashboardPage)
├── types/          # TypeScript interfaces
├── App.tsx         # Root component with routing
├── main.tsx        # Entry point
└── index.css       # Custom styles
```

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Start dev server:**
   ```sh
   npm run dev
   ```
3. **Backend:** Ensure the ERP Demo Backend is running (default: `http://localhost:8000`)

## Features

- JWT-based login with error handling
- Auth context for centralized token management
- Protected routes (redirect to login if unauthenticated)
- Axios interceptor for automatic Bearer token injection
- Role-based permission guards (PermissionGuard)
- Permission-based navigation links
- Responsive navbar with hamburger menu
- CRUD operations for Products, Product Categories, and Users

## Related

- Backend: [erp-demo](https://github.com/taantti/erp-demo)

## License

MIT