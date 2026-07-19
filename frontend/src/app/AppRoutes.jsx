import { Navigate, Route, Routes } from "react-router";
import PublicLayout from "./layouts/PublicLayout.jsx";
import AuthLayout from "./layouts/AuthLayout.jsx";
import ProtectedLayout from "./layouts/ProtectedLayout.jsx";
import HomePage from "../features/catalog/pages/HomePage.jsx";
import ProductsPage from "../features/catalog/pages/ProductsPage.jsx";
import CategoryPage from "../features/catalog/pages/CategoryPage.jsx";
import BrandPage from "../features/catalog/pages/BrandPage.jsx";
import ProductDetailPage from "../features/catalog/pages/ProductDetailPage.jsx";
import LoginPage from "../features/auth/pages/LoginPage.jsx";
import RegisterPage from "../features/auth/pages/RegisterPage.jsx";
import { PublicOnlyRoute, RequireAuth } from "./components/RouteGuard.jsx";
import CartPage from "../features/cart/pages/CartPage.jsx";
import CheckoutPage from "../features/checkout/pages/CheckoutPage.jsx";
import CheckoutSuccessPage from "../features/checkout/pages/CheckoutSuccessPage.jsx";
import OrdersPage from "../features/orders/pages/OrdersPage.jsx";

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
          <Route path="checkout" element={<CheckoutPage />} />
          <Route path="checkout/success" element={<CheckoutSuccessPage />} />
          <Route path="orders" element={<OrdersPage />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
