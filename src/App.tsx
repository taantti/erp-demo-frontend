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
import StocksPage from "./pages/StocksPage";
import StockFormPage from "./pages/StockFormPage";
import StockShelvesPage from "./pages/StockShelvesPage";
import StockShelfFormPage from "./pages/StockShelfFormPage";
import CustomersPage from "./pages/CustomersPage";
import CustomerFormPage from "./pages/CustomerFormPage";
import PurchaseOrdersPage from "./pages/PurchaseOrdersPage";
import PurchaseOrderFormPage from "./pages/PurchaseOrderFormPage";
import SaleOrdersPage from "./pages/SaleOrdersPage";
import SaleOrderFormPage from "./pages/SaleOrderFormPage";

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
        <Route path="/customers" element={
          <ProtectedRoute>
            <PermissionGuard module="customer" feature="readCustomers">
              <CustomersPage />
            </PermissionGuard>
          </ProtectedRoute>
        } />
        <Route path="customers/new" element={
          <ProtectedRoute>
            <PermissionGuard module="customer" feature="createCustomer">
              <CustomerFormPage />
            </PermissionGuard>
          </ProtectedRoute>
        } />
        <Route path="/customers/:id/edit" element={
          <ProtectedRoute>
            <PermissionGuard module="customer" feature="updateCustomer">
              <CustomerFormPage />
            </PermissionGuard>
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
        <Route path="/purchase-orders" element={
          <ProtectedRoute>
            <PermissionGuard module="purchaseOrder" feature="readPurchaseOrders">
              <PurchaseOrdersPage />
            </PermissionGuard>
          </ProtectedRoute>
        } />
        <Route path="/purchase-orders/new" element={
          <ProtectedRoute>
            <PermissionGuard module="purchaseOrder" feature="createPurchaseOrder">
              <PurchaseOrderFormPage />
            </PermissionGuard>
          </ProtectedRoute>
        } />
        <Route path="/purchase-orders/:id/edit" element={
          <ProtectedRoute>
            <PermissionGuard module="purchaseOrder" feature="updatePurchaseOrder">
              <PurchaseOrderFormPage />
            </PermissionGuard>
          </ProtectedRoute>
        } />
        <Route path="/sale-orders" element={
          <ProtectedRoute>
            <PermissionGuard module="saleOrder" feature="readSaleOrders">
              <SaleOrdersPage />
            </PermissionGuard>
          </ProtectedRoute>
        } />

        <Route path="/sale-orders/new" element={
          <ProtectedRoute>
            <PermissionGuard module="saleOrder" feature="createSaleOrder">
              <SaleOrderFormPage></SaleOrderFormPage>
            </PermissionGuard>
          </ProtectedRoute>
        } />
        <Route path="/sale-orders/:id/edit" element={
          <ProtectedRoute>
            <PermissionGuard module="saleOrder" feature="updateSaleOrder">
              <SaleOrderFormPage></SaleOrderFormPage>
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
        <Route path="/stocks" element={
          <ProtectedRoute>
            <PermissionGuard module="stock" feature="readStocks">
              <StocksPage />
            </PermissionGuard>
          </ProtectedRoute>
        } />
        <Route path="/stocks/new" element={
          <ProtectedRoute>
            <PermissionGuard module="stock" feature="createStock">
              <StockFormPage />
            </PermissionGuard>
          </ProtectedRoute>
        } />
        <Route path="/stocks/:id/edit" element={
          <ProtectedRoute>
            <PermissionGuard module="stock" feature="updateStock">
              <StockFormPage />
            </PermissionGuard>
          </ProtectedRoute>
        } />
        <Route path="/stocks/shelves" element={
          <ProtectedRoute>
            <PermissionGuard module="stock" feature="readShelves">
              <StockShelvesPage />
            </PermissionGuard>
          </ProtectedRoute>
        } />
        <Route path="/stocks/shelves/new" element={
          <ProtectedRoute>
            <PermissionGuard module="stock" feature="createShelf">
              <StockShelfFormPage />
            </PermissionGuard>
          </ProtectedRoute>
        } />
        <Route path="/stocks/shelves/:id/edit" element={
          <ProtectedRoute>
            <PermissionGuard module="stock" feature="updateShelf">
              <StockShelfFormPage />
            </PermissionGuard>
          </ProtectedRoute>
        } />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </div>
  )
}

export default App
