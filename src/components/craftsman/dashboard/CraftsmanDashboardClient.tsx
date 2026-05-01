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
    <div className="w-full max-w-[1440px] mx-auto space-y-8 animate-in fade-in duration-700" style={{ fontFamily: "'Nunito', sans-serif" }}>
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-[#1A1A2E] flex items-center gap-3 tracking-tight">
            <span className="w-1.5 h-8 rounded-full bg-[#17409A]"></span>
            Sảnh Thợ Thủ Công
          </h1>
          <p className="text-slate-500 mt-1.5 font-medium text-sm md:text-base">
            Chào mừng trở lại, <span className="text-[#17409A] font-bold">{user?.name}</span>. Chúc bạn một ngày làm việc đầy cảm hứng!
          </p>
        </div>
        <div className="shrink-0">
          <div className="bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-50 flex items-center gap-4 hover:shadow-md transition-shadow duration-300">
            <div className="w-12 h-12 rounded-xl bg-[#17409A]/5 flex items-center justify-center text-[#17409A] shadow-inner">
              <MdTrendingUp className="text-2xl" />
            </div>
            <div>
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-0.5">
                Hiệu suất tháng này
              </div>
              <div className="text-base font-black text-[#17409A]">+12.5%</div>
            </div>
          </div>
        </div>
      </div>

      <StatCards stats={stats} loading={loading} />
      
      <QuickLinks />
    </div>
  );
}
