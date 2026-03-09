"use client";

import { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { MdAssignment, MdAdd } from "react-icons/md";
import StaffReportsHero from "./StaffReportsHero";
import StaffReportsList from "./StaffReportsList";
import StaffReportForm from "./StaffReportForm";

export default function StaffReportsClient() {
  const ref      = useRef<HTMLDivElement>(null);
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted]  = useState(0); // increment to force re-render list

  useEffect(() => {
    if (!ref.current) return;
    const ctx = gsap.context(() => {
      gsap.from(".ac", {
        opacity: 0,
        y: 22,
        duration: 0.5,
        stagger: 0.07,
        ease: "power2.out",
        clearProps: "all",
      });
    }, ref);
    return () => ctx.revert();
  }, []);

  function handleFormSubmit() {
    setShowForm(false);
    setSubmitted((n) => n + 1);
  }

  return (
    <div ref={ref} className="space-y-5">
      {/* Title row */}
      <div className="ac flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MdAssignment style={{ color: "#17409A", fontSize: 22 }} />
            <h1
              className="font-black text-xl text-[#1A1A2E] tracking-tight"
              style={{ fontFamily: "'Nunito', sans-serif" }}
            >
              Báo cáo
            </h1>
          </div>
          <p className="text-[#9CA3AF] text-sm">
            Ghi lại chi tiết từng ca — sự cố, tình trạng kho, ghi chú bàn giao.
          </p>
        </div>

        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 bg-[#17409A] hover:bg-[#1a3a8a] text-white text-sm font-bold px-5 py-2.5 rounded-2xl transition-colors cursor-pointer shadow-lg shadow-[#17409A]/20 shrink-0"
        >
          <MdAdd className="text-base" /> Tạo báo cáo
        </button>
      </div>

      {/* Hero stats */}
      <div className="ac">
        <StaffReportsHero />
      </div>

      {/* Reports list */}
      <div className="ac">
        <StaffReportsList key={submitted} />
      </div>

      {/* Form modal */}
      {showForm && (
        <StaffReportForm
          onClose={() => setShowForm(false)}
          onSubmit={handleFormSubmit}
        />
      )}
    </div>
  );
}
