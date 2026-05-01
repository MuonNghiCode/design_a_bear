"use client";

import { useRef } from "react";
import {
  IoBagOutline,
  IoHeartOutline,
  IoStarOutline,
  IoShieldCheckmarkOutline,
  IoConstructOutline,
} from "react-icons/io5";
import OrdersTab from "./tabs/OrdersTab";
import WishlistTab from "./tabs/WishlistTab";
import ReviewsTab from "./tabs/ReviewsTab";
import SecurityTab from "./tabs/SecurityTab";
import ProductIssuesTab from "./tabs/ProductIssuesTab";

const TABS = [
  { key: "orders", label: "Đơn hàng", icon: IoBagOutline },
  { key: "wishlist", label: "Yêu thích", icon: IoHeartOutline },
  { key: "reviews", label: "Đánh giá", icon: IoStarOutline },
  { key: "issues", label: "Bảo hành", icon: IoConstructOutline },
  { key: "security", label: "Bảo mật", icon: IoShieldCheckmarkOutline },
];

interface Props {
  tab: string;
  onSwitch: (key: string) => void;
  tabContentRef: React.RefObject<HTMLDivElement | null>;
  onLogout: () => void;
}

export default function ProfileTabs({
  tab,
  onSwitch,
  tabContentRef,
  onLogout,
}: Props) {
  return (
    <div className="xl:col-span-3 bg-white rounded-3xl p-8 md:p-10 shadow-sm min-h-[640px] border border-slate-50 flex flex-col justify-between">
      <div>
        {/* Tab bar */}
        <div className="flex gap-2 flex-wrap mb-8 pb-5 border-b border-[#F4F7FF]">
          {TABS.map(({ key, label, icon: Icon }) => {
            const active = tab === key;
            return (
              <button
                key={key}
                onClick={() => onSwitch(key)}
                className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-xs font-black tracking-wide transition-all duration-300 hover:-translate-y-0.5 ${
                  active
                    ? "bg-[#17409A] text-white shadow-xl shadow-[#17409A]/15 border border-[#17409A]"
                    : "bg-[#F4F7FF] text-[#6B7280] hover:bg-[#E8EEF9] border border-transparent"
                }`}
              >
                <Icon className="text-base" />
                {label}
              </button>
            );
          })}
        </div>

        {/* Tab content */}
        <div ref={tabContentRef} className="animate-in fade-in duration-500">
          {tab === "orders" && <OrdersTab />}
          {tab === "wishlist" && <WishlistTab />}
          {tab === "reviews" && <ReviewsTab />}
          {tab === "issues" && <ProductIssuesTab />}
          {tab === "security" && <SecurityTab onLogout={onLogout} />}
        </div>
      </div>
    </div>
  );
}
