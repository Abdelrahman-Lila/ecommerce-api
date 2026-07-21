import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router";
import PublicLayout from "./layouts/PublicLayout.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";
import ProtectedLayout from "./layouts/ProtectedLayout.jsx";
import AdminLayout from "./layouts/AdminLayout.jsx";
import HomePage from "../features/catalog/pages/HomePage.jsx";
import ProductsPage from "../features/catalog/pages/ProductsPage.jsx";
import CategoryPage from "../features/catalog/pages/CategoryPage.jsx";
import BrandPage from "../features/catalog/pages/BrandPage.jsx";
import ProductDetailPage from "../features/catalog/pages/ProductDetailPage.jsx";
import LoginPage from "../features/auth/pages/LoginPage.jsx";
import RegisterPage from "../features/auth/pages/RegisterPage.jsx";
import ProfilePage from "../features/auth/pages/ProfilePage.jsx";
import UpdateProfilePage from "../features/auth/pages/UpdateProfilePage.jsx";
import {
  PublicOnlyRoute,
  RequireAdmin,
  RequireAuth,
  RequireCustomer,
} from "./components/RouteGuard.jsx";
import CartPage from "../features/cart/pages/CartPage.jsx";
import CheckoutPage from "../features/checkout/pages/CheckoutPage.jsx";
import CheckoutSuccessPage from "../features/checkout/pages/CheckoutSuccessPage.jsx";
import OrdersPage from "../features/orders/pages/OrdersPage.jsx";
import LoadingState from "../components/ui/LoadingState.jsx";

const AdminDashboardPage = lazy(
  () => import("../features/admin/pages/AdminDashboardPage.jsx"),
);
const AdminCategoriesPage = lazy(
  () => import("../features/admin/pages/AdminCategoriesPage.jsx"),
);
const AdminSubcategoriesPage = lazy(
  () => import("../features/admin/pages/AdminSubcategoriesPage.jsx"),
);
const AdminBrandsPage = lazy(
  () => import("../features/admin/pages/AdminBrandsPage.jsx"),
);
const AdminProductsPage = lazy(
  () => import("../features/admin/pages/AdminProductsPage.jsx"),
);
const AdminUsersPage = lazy(
  () => import("../features/admin/pages/AdminUsersPage.jsx"),
);
const AdminOrdersPage = lazy(
  () => import("../features/admin/pages/AdminOrdersPage.jsx"),
);

const AdminPage = ({ children }) => (
  <Suspense fallback={<LoadingState label="Loading admin page" />}>
    {children}
  </Suspense>
);

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:productId" element={<ProductDetailPage />} />
        <Route path="categories/:categoryId" element={<CategoryPage />} />
        <Route path="brands/:brandId" element={<BrandPage />} />
        <Route path="cart" element={<CartPage />} />
      </Route>

      <Route element={<PublicOnlyRoute />}>
        <Route element={<AuthLayout />}>
          <Route path="login" element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>
      </Route>

      <Route element={<RequireAuth />}>
        <Route element={<ProtectedLayout />}>
          <Route path="profile" element={<ProfilePage />} />
          <Route path="profile/update" element={<UpdateProfilePage />} />
          <Route element={<RequireCustomer />}>
            <Route path="checkout" element={<CheckoutPage />} />
            <Route path="checkout/success" element={<CheckoutSuccessPage />} />
            <Route path="orders" element={<OrdersPage />} />
          </Route>
        </Route>
      </Route>

      <Route element={<RequireAdmin />}>
        <Route element={<AdminLayout />}>
          <Route path="admin" element={<AdminPage><AdminDashboardPage /></AdminPage>} />
          <Route path="admin/categories" element={<AdminPage><AdminCategoriesPage /></AdminPage>} />
          <Route
            path="admin/subcategories"
            element={<AdminPage><AdminSubcategoriesPage /></AdminPage>}
          />
          <Route path="admin/brands" element={<AdminPage><AdminBrandsPage /></AdminPage>} />
          <Route path="admin/products" element={<AdminPage><AdminProductsPage /></AdminPage>} />
          <Route path="admin/users" element={<AdminPage><AdminUsersPage /></AdminPage>} />
          <Route path="admin/orders" element={<AdminPage><AdminOrdersPage /></AdminPage>} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
