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
      const isAuthPath = pathname.startsWith("/auth");
      
      // We exclude /api routes and internal next paths if necessary, 
      // though middleware or standard next-handling usually covers those.
      // Here we focus on visible page routes.

      if (user.role === "admin") {
        // Admin must stay in /admin. Cannot access user pages or /staff pages.
        if (!isAdminPath && !isAuthPath) {
          console.log("[RoleGuard] Redirecting Admin to /admin dashboard");
          router.replace("/admin");
        }
      } else if (user.role === "staff") {
        // Staff must stay in /staff. Cannot access user pages or /admin pages.
        if (!isStaffPath && !isAuthPath) {
          console.log("[RoleGuard] Redirecting Staff to /staff dashboard");
          router.replace("/staff");
        }
      }
      // Note: "user" role (Role 3) can access everything EXCEPT /admin and /staff
      // (which is handled by other guards usually found in those specific pages).
    }
  }, [user, loading, isAuthenticated, pathname, router]);

  return <>{children}</>;
}
