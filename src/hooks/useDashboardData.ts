"use client";

import { useCallback, useState } from "react";
import { reportService } from "@/services/report.service";
import { orderService } from "@/services/order.service";
import { userService } from "@/services/user.service";
import { productService } from "@/services/product.service";
import type { RevenueReportData, OrderListItem, UserDetail, ProductListItem } from "@/types";

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalStaff: number;
  avgOrderValue: number;
  recentOrders: (OrderListItem & { customerName?: string })[];
  dailyRevenue: { date: string; revenue: number }[];
  topProducts: ProductListItem[];
  orderStatusDistribution: Record<string, number>;
}

export function useDashboardData() {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const end = new Date();
      const start = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);

      const [revenueRes, ordersRes, usersRes, topProductsRes] = await Promise.allSettled([
        reportService.getRevenueReport({
          startDate: start.toISOString(),
          endDate: end.toISOString(),
        }),
        orderService.getOrders({ pageIndex: 1, pageSize: 20 }),
        userService.getUsers(),
        productService.getTopProducts(6),
      ]);

      let revenue: RevenueReportData | null = null;
      let recentOrdersRaw: OrderListItem[] = [];
      let users: UserDetail[] = [];
      let topProducts: ProductListItem[] = [];

      if (revenueRes.status === "fulfilled" && revenueRes.value?.isSuccess) {
        revenue = revenueRes.value.value;
      }
      if (
        ordersRes.status === "fulfilled" &&
        ordersRes.value?.isSuccess &&
        ordersRes.value.value
      ) {
        const val = ordersRes.value.value;
        recentOrdersRaw = Array.isArray(val)
          ? (val as unknown as OrderListItem[])
          : (val as { items?: OrderListItem[] })?.items ?? [];
      }
      if (usersRes.status === "fulfilled" && usersRes.value?.isSuccess) {
        users = usersRes.value.value ?? [];
      }
      if (topProductsRes.status === "fulfilled" && topProductsRes.value?.isSuccess) {
        topProducts = topProductsRes.value.value ?? [];
      }

      // Order status distribution
      const statusMap: Record<string, number> = {};
      recentOrdersRaw.forEach(o => {
        const s = o.status || "UNKNOWN";
        statusMap[s] = (statusMap[s] || 0) + 1;
      });

      // Role check: Now using BE fixed roleName
      const customers = users.filter((u) => {
        const role = (u.roleName || "").toLowerCase();
        return role.includes("customer") || role === "user" || role === "khách hàng" || role === "parent";
      });
      
      const staff = users.filter((u) => {
        const role = (u.roleName || "").toLowerCase();
        return !role.includes("customer") && role !== "user" && role !== "khách hàng" && role !== "parent";
      });

      const recentOrders = recentOrdersRaw.slice(0, 10).map(order => {
        const user = users.find(u => u.userId === order.userId);
        return {
          ...order,
          customerName: user ? user.fullName : "Khách vãng lai"
        };
      });

      setStats({
        totalRevenue: revenue?.totalRevenue ?? 0,
        totalOrders: revenue?.totalOrders ?? 0,
        totalCustomers: customers.length,
        totalStaff: staff.length,
        avgOrderValue:
          (revenue?.totalOrders ?? 0) > 0
            ? (revenue?.totalRevenue ?? 0) / (revenue?.totalOrders ?? 1)
            : 0,
        recentOrders,
        dailyRevenue: (revenue?.dailyBreakdown ?? []).map((d) => ({
          date: d.date,
          revenue: d.revenue,
        })),
        topProducts,
        orderStatusDistribution: statusMap,
      });
    } catch (err) {
      console.error(err);
      setError("Không thể tải dữ liệu dashboard.");
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, stats, error, fetch };
}
