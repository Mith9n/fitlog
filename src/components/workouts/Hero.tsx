
import Image from "next/image";
import Link from "next/link";

export default function Hero() {
  return (
    <section className="mx-auto mt-10 w-[calc(100%-32px)] max-w-[1200px]">
      {/* Hero Card */}
      <div className="grid min-h-[300px] grid-cols-1 items-center overflow-hidden rounded-[14px] border border-[#25272d] bg-[#15161b] px-6 py-8 sm:px-10 md:h-[390px] md:min-h-0 md:grid-cols-[1.25fr_0.75fr] md:px-[46px] md:py-0 lg:h-[460px]">
        {/* Left: Text Content */}
        <div className="relative z-10 order-2 text-center md:order-1 md:text-left">
          <p className="mb-5 text-[10px] font-bold tracking-[1.5px] text-[#c8ff00]">
            WORKOUT LIBRARY
          </p>

          <h1 className="text-[36px] leading-[0.98] font-black tracking-[-1.5px] text-white sm:text-[44px] md:text-[48px] lg:text-[52px]">
            TRAIN WITH INTENT. LOG
            <br />
            EVERY SET.
          </h1>

          <p className="mt-4 max-w-[430px] text-[13px] leading-[1.6] text-[#a1a1aa]">
            FitLog is a dark, no-nonsense gym companion: pick a lift, lock it
            into today&apos;s plan, and watch the week&apos;s work add up.
          </p>

          <Link
            href="#library"
            className="mt-6 inline-flex h-[34px] items-center justify-center rounded-[5px] bg-[#c8ff00] px-5 text-[10px] font-bold text-black transition-colors hover:bg-[#d9ff55]"
          >
            BROWSE WORKOUTS
          </Link>
        </div>

        {/* Right: Workout Image */}
        <div className="relative mx-auto order-1 h-[220px] w-full max-w-[340px] sm:h-[260px] md:order-2 md:h-full md:max-w-none">
          <Image
            src="/assets/banner.png"
            alt="Workout training illustration"
            fill
            priority
            sizes="(max-width: 768px) 100vw, 40vw"
            className="object-contain"
          />
        </div>
      </div>
    </section>
  );
}
