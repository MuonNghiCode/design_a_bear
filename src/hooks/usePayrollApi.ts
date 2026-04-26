"use client";

import { useCallback, useState, useEffect } from "react";
import { productionJobService } from "@/services/productionJob.service";
import { userService } from "@/services/user.service";
import type { ProductionJob, UserDetail } from "@/types";

export interface StaffPayrollEntry {
  userId: string;
  fullName: string;
  avatarUrl: string | null;
  roleName: string;
  completedJobs: number;
  craftsmanCommission: number;
  qcCommission: number;
  totalEarned: number;
  jobs: ProductionJob[];
}

// Roles that can earn commission — match actual roleName from backend
const STAFF_ROLES = ["craftsman", "qualitycontrol", "qcinspector", "qc", "staff"];

function normalizeRole(roleName?: string) {
  return (roleName ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "");
}

export function usePayrollApi(autoStartDate?: string, autoEndDate?: string) {
  const [loading, setLoading] = useState(false);
  const [entries, setEntries] = useState<StaffPayrollEntry[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchPayroll = useCallback(
    async (startDate: string, endDate: string) => {
      setLoading(true);
      setError(null);
      try {
        const usersRes = await userService.getUsers();
        if (!usersRes.isSuccess || !usersRes.value) {
          setError("Không thể tải danh sách nhân viên.");
          return;
        }

        // Include ALL non-admin, non-customer staff (role 2=Craftsman, 4=Staff, 5=QC)
        const staff: UserDetail[] = usersRes.value.filter((u) => {
          const role = normalizeRole(u.roleName);
          return STAFF_ROLES.some((r) => role.includes(r));
        });

        if (staff.length === 0) {
          // If no staff found, try with all users that aren't customers
          const allNonCustomer = usersRes.value.filter((u) => {
            const role = u.roleName?.toLowerCase() ?? "";
            return !role.includes("customer") && !role.includes("admin");
          });
          staff.push(...allNonCustomer);
        }

        const start = new Date(startDate + "T00:00:00");
        const end = new Date(endDate + "T23:59:59");
        const qcStaff = usersRes.value.filter((u) => {
          const role = normalizeRole(u.roleName);
          return role.includes("qualitycontrol") || role.includes("qcinspector") || role === "qc";
        });

        const finishedJobsRes =
          qcStaff.length > 0
            ? await productionJobService.getByStatus("FINISHED")
            : null;
        const finishedJobs =
          finishedJobsRes?.isSuccess && finishedJobsRes.value
            ? finishedJobsRes.value
            : [];

        const results: StaffPayrollEntry[] = await Promise.all(
          staff.map(async (user) => {
            try {
              const role = normalizeRole(user.roleName);
              const isQc =
                role.includes("qualitycontrol") ||
                role.includes("qcinspector") ||
                role === "qc";
              const jobsRes = isQc
                ? { isSuccess: true, value: finishedJobs }
                : await productionJobService.getByTechnician(user.userId);
              const allJobs =
                jobsRes.isSuccess && jobsRes.value ? jobsRes.value : [];

              // Filter jobs in date range that have some completion status
              const filtered = allJobs.filter((j) => {
                const isAssignedToUser = isQc
                  ? j.qcInspectorId === user.userId
                  : j.technicianId === user.userId ||
                    j.espTechnicianId === user.userId ||
                    j.shellTechnicianId === user.userId;

                if (!isAssignedToUser) return false;

                const dateStr = isQc
                  ? j.qcFinishedAt || j.completedAt || j.espFinishedAt || j.shellFinishedAt
                  : j.completedAt || j.espFinishedAt || j.shellFinishedAt;
                if (!dateStr) return false;
                const date = new Date(dateStr);
                return date >= start && date <= end;
              });

              const totalCraftsman = filtered.reduce(
                (s, j) => s + (j.craftsmanCommission ?? 0),
                0
              );
              const totalQc = filtered.reduce(
                (s, j) => s + (j.qcCommission ?? 0),
                0
              );

              return {
                userId: user.userId,
                fullName: user.fullName,
                avatarUrl: user.avatarUrl,
                roleName: user.roleName ?? "Staff",
                completedJobs: filtered.length,
                craftsmanCommission: totalCraftsman,
                qcCommission: totalQc,
                totalEarned: totalCraftsman + totalQc,
                jobs: filtered,
              };
            } catch {
              return {
                userId: user.userId,
                fullName: user.fullName,
                avatarUrl: user.avatarUrl,
                roleName: user.roleName ?? "Staff",
                completedJobs: 0,
                craftsmanCommission: 0,
                qcCommission: 0,
                totalEarned: 0,
                jobs: [],
              };
            }
          })
        );

        setEntries(results.sort((a, b) => b.totalEarned - a.totalEarned));
      } catch (err) {
        console.error(err);
        setError("Đã xảy ra lỗi khi tính lương.");
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Auto-load on mount if dates provided
  useEffect(() => {
    if (autoStartDate && autoEndDate) {
      fetchPayroll(autoStartDate, autoEndDate);
    }
  }, [autoStartDate, autoEndDate, fetchPayroll]);

  return { loading, entries, error, fetchPayroll };
}
