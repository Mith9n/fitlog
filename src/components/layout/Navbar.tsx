
"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  PLAN_STORAGE_KEY,
  read_workouts,
  SAVED_STORAGE_KEY,
  subscribe_to_workout_updates,
} from "@/lib/workouts-storage";

export default function Navbar() {
  const pathname = usePathname();
  const [plan_count, set_plan_count] = useState(0);
  const [saved_count, set_saved_count] = useState(0);

  useEffect(() => {
    function update_counts() {
      set_plan_count(read_workouts(PLAN_STORAGE_KEY).length);
      set_saved_count(read_workouts(SAVED_STORAGE_KEY).length);
    }

    update_counts();
    return subscribe_to_workout_updates(update_counts);
  }, []);

  // Only the current route stays active
  const is_workouts_active = pathname === "/";
  const is_plan_active = pathname === "/my-plan" || pathname.startsWith("/my-plan/");

  return (
    <header className="border-b border-[#202124] bg-[#0b0c0e] text-white md:h-[70px]">
      <nav className="relative mx-auto flex min-h-[70px] flex-wrap items-center justify-between gap-x-2 gap-y-2 px-4 py-3 md:h-full md:flex-nowrap md:px-6 md:py-0">
        {/* Logo + Brand Name */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
         <Image
      src="/assets/logo.png"
      alt="FitLog Logo"
      width={28}
      height={28}
      priority
      className="h-[18px] w-[18px] object-contain"
    />

          <span className="text-[18px] font-black tracking-[-0.5px]">
            FITLOG<span className="text-[#c8ff00]">.</span>
          </span>
        </Link>

        {/* Center Navigation */}
        <div className="order-3 flex basis-full items-center justify-center gap-1 md:absolute md:left-1/2 md:order-none md:basis-auto md:-translate-x-1/2">
          {/* Workouts */}
          <Link
            href="/"
            className={`rounded-full px-3.5 py-1.5 text-[10px] transition-colors duration-200 ${
              is_workouts_active
                ? "bg-[#1b2410] font-semibold text-[#c8ff00]"
                : "text-[#a1a1aa] hover:bg-[#1b2410] hover:text-[#c8ff00]"
            }`}
          >
            Workouts
          </Link>

          {/* My Plan */}
          <Link
            href="/my-plan#plan"
            className={`rounded-full px-3.5 py-1.5 text-[10px] transition-colors duration-200 ${
              is_plan_active
                ? "bg-[#1b2410] font-semibold text-[#c8ff00]"
                : "text-[#a1a1aa] hover:bg-[#1b2410] hover:text-[#c8ff00]"
            }`}
          >
            My Plan
          </Link>
        </div>

        {/* Right: Plan + Saved */}
        <div className="flex shrink-0 items-center gap-3 sm:gap-5">
          <Link
            href="/my-plan#plan"
            className="flex items-center gap-2 text-[10px] text-[#e4e4e7] transition-colors hover:text-[#c8ff00]"
          >
            Plan
            <span className="flex h-[17px] w-[17px] items-center justify-center rounded-full bg-[#c8ff00] text-[9px] font-bold text-black">
              {plan_count}
            </span>
          </Link>

          <Link
            href="/my-plan#saved"
            className="flex items-center gap-2 text-[10px] text-[#a1a1aa] transition-colors hover:text-white"
          >
            Saved
            <span className="flex h-[17px] w-[17px] items-center justify-center rounded-full border border-[#34363b] text-[9px] text-white">
              {saved_count}
            </span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
