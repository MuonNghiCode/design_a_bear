"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { MdAutorenew } from "react-icons/md";
import CustomersHero from "@/components/admin/customers/CustomersHero";
import CustomersTable from "@/components/admin/customers/CustomersTable";
import { userService } from "@/services/user.service";
import type { UserDetail } from "@/types";

export default function CustomersClient() {
  const ref = useRef<HTMLDivElement>(null);
  const [users, setUsers] = useState<UserDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await userService.getUsers();
      if (res.isSuccess) {
        setUsers(res.value || []);
      }
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchUsers();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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
      {/* ── Page Header ── */}
      <div className="ac flex items-end justify-between flex-wrap gap-2">
        <div>
          <h1 className="text-[#1A1A2E] font-black text-2xl leading-tight">
            Khách hàng
          </h1>
          <p className="text-[#9CA3AF] text-sm font-semibold tracking-wide opacity-70">
            Quản lý cơ sở dữ liệu khách hàng ·{" "}
            {new Date().toLocaleDateString("vi-VN", {
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 bg-[#17409A] text-white text-xs font-black px-6 py-3 rounded-2xl hover:bg-[#0f2d70] transition-all active:scale-95 shadow-lg shadow-blue-900/10 uppercase tracking-widest"
          disabled={loading || refreshing}
        >
          {loading || refreshing ? (
            <>
              <MdAutorenew className="text-lg animate-spin" />
              Đang đồng bộ...
            </>
          ) : (
            <>
              <MdAutorenew className="text-lg" />
              Làm mới dữ liệu
            </>
          )}
        </button>
      </div>

      {/* Full-width Customers Hero */}
      <div className="ac">
        <CustomersHero customers={customers} loading={loading} />
      </div>

      {/* Full-width customers table */}
      <div className="ac">
        <CustomersTable />
      </div>
    </div>
  );
}
