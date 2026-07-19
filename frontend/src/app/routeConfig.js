export const publicNavItems = [
  { to: "/", label: "Home" },
  { to: "/products", label: "Products" },
];

export const protectedNavItems = [
  { to: "/cart", label: "Cart" },
  { to: "/checkout", label: "Checkout" },
  { to: "/orders", label: "Orders" },
];

export const authNavItems = [
  { to: "/login", label: "Sign in" },
  { to: "/register", label: "Register" },
];

export const adminNavItems = [
  { to: "/admin", label: "Overview" },
  { to: "/admin/products", label: "Products" },
  { to: "/admin/categories", label: "Categories" },
  { to: "/admin/subcategories", label: "Subcategories" },
  { to: "/admin/brands", label: "Brands" },
  { to: "/admin/orders", label: "Orders" },
  { to: "/admin/users", label: "Users" },
];

export const storefrontRoutes = [
  {
    path: "/",
    area: "Public storefront",
    title: "Storefront shell",
    description:
      "A public landing page shell for catalog browsing, featured products, and category discovery.",
  },
  {
    path: "/products",
    area: "Public storefront",
    title: "Products catalog",
    description:
      "A searchable and filterable product listing that will later consume the catalog hooks.",
  },
  {
    path: "/products/:productId",
    area: "Public storefront",
    title: "Product details",
    description:
      "A product detail route for price, gallery, options, and add-to-cart actions.",
  },
  {
    path: "/categories/:categoryId",
    area: "Public storefront",
    title: "Category view",
    description:
      "A catalog route for narrowing the storefront to a single backend category.",
  },
  {
    path: "/brands/:brandId",
    area: "Public storefront",
    title: "Brand view",
    description:
      "A brand-focused storefront route for browsing products by brand.",
  },
];

export const authRoutes = [
  {
    path: "/login",
    area: "Auth",
    title: "Sign in",
    description:
      "Authentication shell for token-based login with React Hook Form and Zod.",
  },
  {
    path: "/register",
    area: "Auth",
    title: "Create account",
    description:
      "Registration shell for new customer accounts and initial token issuance.",
  },
];

export const customerRoutes = [
  {
    path: "/cart",
    area: "Cart and checkout",
    title: "Cart",
    description:
      "A protected cart workspace for quantity updates, totals, and checkout handoff.",
  },
  {
    path: "/checkout",
    area: "Cart and checkout",
    title: "Checkout",
    description:
      "A protected order submission flow that will post to the existing order endpoint.",
  },
  {
    path: "/checkout/success",
    area: "Cart and checkout",
    title: "Order confirmed",
    description:
      "A protected confirmation page for a recently submitted order.",
  },
  {
    path: "/orders",
    area: "Customer orders",
    title: "My orders",
    description:
      "A protected order history route that will read user orders from the backend.",
  },
];

export const adminRoutes = [
  {
    path: "/admin",
    area: "Management",
    title: "Admin overview",
    description:
      "An admin shell for management navigation and top-level operational summaries.",
  },
  {
    path: "/admin/products",
    area: "Management",
    title: "Manage products",
    description:
      "A protected admin route for the existing product CRUD endpoints and upload flow.",
  },
  {
    path: "/admin/categories",
    area: "Management",
    title: "Manage categories",
    description:
      "A protected admin route for category CRUD against the existing API.",
  },
  {
    path: "/admin/subcategories",
    area: "Management",
    title: "Manage subcategories",
    description:
      "A protected admin route for subcategory CRUD against the existing API.",
  },
  {
    path: "/admin/brands",
    area: "Management",
    title: "Manage brands",
    description:
      "A protected admin route for brand CRUD against the existing API.",
  },
  {
    path: "/admin/orders",
    area: "Management",
    title: "Manage orders",
    description:
      "A protected admin route for order review, update, and deletion.",
  },
  {
    path: "/admin/users",
    area: "Management",
    title: "Manage users",
    description:
      "A protected admin route for user review using the existing admin users endpoint.",
  },
];
