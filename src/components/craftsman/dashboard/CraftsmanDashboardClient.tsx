"use client";

import { useEffect, useState } from "react";
import { GiHammerBreak } from "react-icons/gi";
import { MdTrendingUp } from "react-icons/md";
import { productionJobService } from "@/services";
import { useAuth } from "@/contexts/AuthContext";
import StatCards from "./StatCards";
import QuickLinks from "./QuickLinks";

export default function CraftsmanDashboardClient() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    activeJobs: 0,
    completedJobs: 0,
    totalCommission: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      if (!user?.id) return;
      try {
        const response = await productionJobService.getByTechnician(user.id);
        if (response.isSuccess && response.value) {
          const jobs = response.value;
          setStats({
            activeJobs: jobs.filter(j => j.status !== "FINISHED").length,
            completedJobs: jobs.filter(j => j.status === "FINISHED").length,
            totalCommission: jobs.reduce((acc, j) => acc + j.craftsmanCommission, 0),
          });
        }
      } catch (error) {
        console.error("Failed to fetch craftsman stats", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, [user?.id]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black text-[#17409A] flex items-center gap-3">
            <GiHammerBreak className="text-3xl" />
            Bảng điều khiển thợ thủ công
          </h1>
          <p className="text-slate-500 mt-1 font-medium">
            Chào mừng trở lại, {user?.name}! Chúc bạn một ngày làm việc năng suất.
          </p>
        </div>
        <div className="hidden md:block">
          <div className="bg-white px-4 py-2 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#17409A]/10 flex items-center justify-center text-[#17409A]">
              <MdTrendingUp className="text-xl" />
            </div>
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-wider">
                Hiệu suất tháng này
              </div>
              <div className="text-sm font-black text-[#17409A]">+12.5%</div>
            </div>
          </div>
        </div>
      </div>

      <StatCards stats={stats} loading={loading} />
      
      <QuickLinks />
    </div>
  );
}
