import { Outlet } from "react-router";
import SiteHeader from "../../components/layout/SiteHeader.jsx";
import PageShell from "../../components/layout/PageShell.jsx";
import { protectedNavItems } from "../routeConfig.js";

export default function ProtectedLayout() {
  return (
    <div className="min-h-screen">
      <SiteHeader links={protectedNavItems} />
      <PageShell className="py-8">
        <Outlet />
      </PageShell>
    </div>
  );
}
