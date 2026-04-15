import { BrowserRouter, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import ProductFormPage from "./pages/ProductFormPage";
import LoginPage from "./pages/LoginPage";
import { AuthProvider, useAuth } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PermissionGuard from "./components/PermissionGuard";
import NavBar from "./components/Navbar";
import ProductCategoriesPage from "./pages/ProductCategoriesPage";
import ProductCategoryFormPage from "./pages/ProductCategoryFormPage";
import UsersPage from "./pages/UsersPage";
import UserFormPage from "./pages/UserFormPage";

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
    <div className="d-flex flex-column min-vh-100 bg-light">
      {isAuthenticated && <NavBar />}
      <Routes>
        <Route path="/" element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        } />
        <Route path="/products" element={
          <ProtectedRoute>
            <PermissionGuard module="product" feature="readProducts">
            <ProductsPage />
            </PermissionGuard>
          </ProtectedRoute>
        } />
        <Route path="/products/new" element={
          <ProtectedRoute>
            <PermissionGuard module="product" feature="createProduct">
            <ProductFormPage />
            </PermissionGuard>
          </ProtectedRoute>
        } />
        <Route path="/products/:id/edit" element={
          <ProtectedRoute>
            <PermissionGuard module="product" feature="updateProduct">
            <ProductFormPage />
            </PermissionGuard>
          </ProtectedRoute>
        } />
        <Route path="/products/categories" element={
          <ProtectedRoute>
            <PermissionGuard module="productCategory" feature="readProductCategories">
            <ProductCategoriesPage />
            </PermissionGuard>
          </ProtectedRoute>
        } />
        <Route path="/products/categories/new" element={
          <ProtectedRoute>
            <PermissionGuard module="productCategory" feature="createProductCategory">
            <ProductCategoryFormPage />
            </PermissionGuard>
          </ProtectedRoute>
        } />
        <Route path="/products/categories/:id/edit" element={
          <ProtectedRoute>
            <PermissionGuard module="productCategory" feature="updateProductCategory">
            <ProductCategoryFormPage />
            </PermissionGuard>
          </ProtectedRoute>
        } />
        <Route path="/users" element={
          <ProtectedRoute>
            <PermissionGuard module="user" feature="readUsers">
            <UsersPage />
            </PermissionGuard>
          </ProtectedRoute>
        } />
        <Route path="/users/new" element={
          <ProtectedRoute>
            <PermissionGuard module="user" feature="createUser">
            <UserFormPage />
            </PermissionGuard>
          </ProtectedRoute>
        } />
        <Route path="/users/:id/edit" element={
          <ProtectedRoute>
            <PermissionGuard module="user" feature="updateUser">
            <UserFormPage />
            </PermissionGuard>
          </ProtectedRoute>
        } />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  )
}

export default App
