"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import CustomersHero from "@/components/admin/customers/CustomersHero";
import CustomersTierChart from "@/components/admin/customers/CustomersTierChart";
import CustomersTable from "@/components/admin/customers/CustomersTable";
import { userService } from "@/services/user.service";
import type { UserDetail } from "@/types";

export default function CustomersClient() {
  const ref = useRef<HTMLDivElement>(null);
  const [users, setUsers] = useState<UserDetail[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await userService.getUsers();
        if (res.isSuccess) {
          setUsers(res.value || []);
        }
      } catch (err) {
        console.error("Failed to fetch users", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  useEffect(() => {
    if (!ref.current || loading) return;
    const ctx = gsap.context(() => {
      gsap.fromTo(
        ".ac",
        { opacity: 0, y: 18 },
        {
          opacity: 1,
          y: 0,
          duration: 0.5,
          ease: "power2.out",
          stagger: 0.07,
          clearProps: "all",
        },
      );
    }, ref);
    return () => ctx.revert();
  }, [loading]);

  // Filter only customers/parents
  const customers = users.filter(u => {
    const role = (u.roleName || "").toLowerCase();
    return role.includes("customer") || role === "user" || role === "khách hàng" || role === "parent";
  });

  return (
    <div ref={ref} className="space-y-8 pb-12" style={{ fontFamily: "var(--font-nunito), Nunito, sans-serif" }}>
      {/* Page title */}
      <div className="ac flex items-end justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-[#1A1A2E] font-black text-3xl tracking-tight">
            Quản Lý Khách Hàng
          </h1>
          <p className="text-[#9CA3AF] text-sm font-bold mt-1">
            Theo dõi hành vi và phân loại thành viên hệ thống
          </p>
        </div>
      </div>

      {/* Hero (left 3/5) + Tier chart (right 2/5) */}
      <div className="ac grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <CustomersHero customers={customers} loading={loading} />
        </div>
        <div className="lg:col-span-2">
          <CustomersTierChart customers={customers} loading={loading} />
        </div>
      </div>

      {/* Full-width customers table */}
      <div className="ac">
        <CustomersTable />
      </div>
    </div>
  );
}
