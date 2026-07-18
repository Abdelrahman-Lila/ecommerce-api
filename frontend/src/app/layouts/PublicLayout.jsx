import { Outlet } from "react-router";
import SiteHeader from "../../components/layout/SiteHeader.jsx";
import SiteFooter from "../../components/layout/SiteFooter.jsx";
import { publicNavItems } from "../routeConfig.js";

export default function PublicLayout() {
  return (
    <div className="min-h-screen">
      <SiteHeader links={publicNavItems} />
      <Outlet />
      <SiteFooter />
    </div>
  );
}
