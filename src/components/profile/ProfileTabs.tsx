"use client";

import { useRef } from "react";
import {
  IoBagOutline,
  IoHeartOutline,
  IoStarOutline,
  IoShieldCheckmarkOutline,
} from "react-icons/io5";
import OrdersTab from "./tabs/OrdersTab";
import WishlistTab from "./tabs/WishlistTab";
import ReviewsTab from "./tabs/ReviewsTab";
import SecurityTab from "./tabs/SecurityTab";

const TABS = [
  { key: "orders", label: "Đơn hàng", icon: IoBagOutline },
  { key: "wishlist", label: "Yêu thích", icon: IoHeartOutline },
  { key: "reviews", label: "Đánh giá", icon: IoStarOutline },
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
    <div className="xl:col-span-3 bg-white rounded-3xl p-8 shadow-sm min-h-[640px]">
      {/* Tab bar */}
      <div className="flex gap-2 flex-wrap mb-8 pb-5 border-b border-[#F4F7FF]">
        {TABS.map(({ key, label, icon: Icon }) => {
          const active = tab === key;
          return (
            <button
              key={key}
              onClick={() => onSwitch(key)}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-black transition-all duration-200 ${
                active
                  ? "bg-[#17409A] text-white shadow-sm"
                  : "bg-[#F4F7FF] text-[#6B7280] hover:bg-[#E8EEF9]"
              }`}
            >
              <Icon className="text-base" />
              {label}
            </button>
          );
        })}
      </div>

      {/* Tab content */}
      <div ref={tabContentRef}>
        {tab === "orders" && <OrdersTab />}
        {tab === "wishlist" && <WishlistTab />}
        {tab === "reviews" && <ReviewsTab />}
        {tab === "security" && <SecurityTab onLogout={onLogout} />}
      </div>
    </div>
  );
}
