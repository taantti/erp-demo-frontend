import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import LoginPage from "./pages/LoginPage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import NavBar from "./components/Navbar";

/**
 * Main application component
 * @returns Main application component
 */
const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppLayout />
      </BrowserRouter>
    </AuthProvider >
  )
}

/**
 * Application layout component
 * @returns Application layout component
 */
const AppLayout = () => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      {isAuthenticated && <NavBar />}
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/products" element={
          <ProtectedRoute>
            <ProductsPage />
          </ProtectedRoute>
        } />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  )
}

export default App
