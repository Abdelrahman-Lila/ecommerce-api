import { Navigate, Route, Routes } from "react-router";
import PublicLayout from "./layouts/PublicLayout.jsx";
import HomePage from "../features/catalog/pages/HomePage.jsx";
import ProductsPage from "../features/catalog/pages/ProductsPage.jsx";
import CategoryPage from "../features/catalog/pages/CategoryPage.jsx";
import BrandPage from "../features/catalog/pages/BrandPage.jsx";
import ProductDetailPage from "../features/catalog/pages/ProductDetailPage.jsx";

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductsPage />} />
        <Route path="products/:productId" element={<ProductDetailPage />} />
        <Route path="categories/:categoryId" element={<CategoryPage />} />
        <Route path="brands/:brandId" element={<BrandPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
