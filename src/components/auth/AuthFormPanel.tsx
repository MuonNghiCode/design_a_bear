"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import AuthCard from "./AuthCard";

export default function AuthFormPanel() {
  const router = useRouter();

  return (
    <div className="relative z-10 flex flex-col items-center justify-center w-full lg:w-[50%] xl:w-[46%] h-full px-4 sm:px-8 gap-4">

      {/* Form card */}
      <div className="w-full max-w-md">
        <AuthCard />
      </div>
    </div>
  );
}
