
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-neutral-800 bg-[#101010] text-white">
      <div className="flex min-h-[90px] flex-col items-center justify-between gap-4 px-6 py-5 sm:flex-row">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src="/assets/Dumbbell.png"
            alt="FitLog Logo"
            width={28}
            height={28}
            className="h-7 w-7 shrink-0 object-contain"
          />

          <span className="text-lg font-black">
            FITLOG<span className="text-lime-300">.</span>
          </span>
        </Link>

        {/* Copyright */}
        <p className="text-center text-xs text-neutral-500">
          © 2026 FitLog — Workout Library. Train hard, log honest.
        </p>
      </div>
    </footer>
  );
}
