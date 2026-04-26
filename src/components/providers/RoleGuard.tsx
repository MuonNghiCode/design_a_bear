"use client";

import { useAuth } from "@/contexts/AuthContext";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

/**
 * RoleGuard Component
 *
 * Ensures that Admin and Staff users are strictly confined to their respective dashboards.
 * If an Admin or Staff user attempts to access client-facing pages (Home, Products, Checkout, etc.),
 * they are automatically redirected back to their specified workspace.
 */
export default function RoleGuard({ children }: { children: React.ReactNode }) {
  const { user, loading, isAuthenticated } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    // We only perform the check when auth loading is finished
    if (!loading && isAuthenticated && user) {
      const isAdminPath = pathname.startsWith("/admin");
      const isStaffPath = pathname.startsWith("/staff");
      const isCraftsmanPath = pathname.startsWith("/craftsman");
      const isQcPath = pathname.startsWith("/qc");
      const isAuthPath = pathname.startsWith("/auth");

      // We exclude /api routes and internal next paths if necessary,
      // though middleware or standard next-handling usually covers those.
      // Here we focus on visible page routes.

      if (user.role === "admin") {
        if (!isAdminPath && !isAuthPath) {
          router.replace("/admin");
        }
      } else if (user.role === "staff") {
        if (!isStaffPath && !isAuthPath) {
          router.replace("/staff");
        }
      } else if (user.role === "craftsman") {
        if (!isCraftsmanPath && !isAuthPath) {
          router.replace("/craftsman");
        }
      } else if (user.role === "quality_control") {
        if (!isQcPath && !isAuthPath) {
          router.replace("/qc");
        }
      }
    }
  }, [user, loading, isAuthenticated, pathname, router]);

  return <>{children}</>;
}
