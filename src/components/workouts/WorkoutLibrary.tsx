
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Clock3, Flame, Star } from "lucide-react";

const API_URL = "https://api.abcz.workers.dev/api/fitlog";

type Workout = {
  id: number;
  name: string;
  image: string;
  muscleGroups: string[];
  equipment: string;
  duration: number;
  caloriesBurned: number;
  rating: number;
};

export default function WorkoutLibrary() {
  const [workouts, set_workouts] = useState<Workout[]>([]);
  const [is_loading, set_is_loading] = useState(true);
  const [error, set_error] = useState("");

  useEffect(() => {
    async function fetch_workouts() {
      try {
        const response = await fetch(API_URL);

        if (!response.ok) {
          throw new Error("Failed to fetch workouts");
        }

        const data: Workout[] = await response.json();
        set_workouts(data);
      } catch {
        set_error("Unable to load workouts. Please try again.");
      } finally {
        set_is_loading(false);
      }
    }

    fetch_workouts();
  }, []);

  return (
    <section
      id="library"
      className="mx-auto w-[calc(100%-36px)] max-w-[1200px] border-t border-[#202124] py-8 sm:py-10"
    >
      {/* Section heading */}
      <div className="mb-6">
        <h2 className="text-[24px] font-black leading-tight tracking-[-0.7px]">
          THE LIBRARY
        </h2>

        <p className="mt-1 text-[11px] text-[#92949d]">
          Twelve lifts covering every major muscle group.
        </p>
      </div>

      {/* Loading state */}
      {is_loading && (
        <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <div
              key={index}
              className="animate-pulse overflow-hidden rounded-[13px] border border-[#25272d] bg-[#15161b]"
            >
              <div className="h-[148px] bg-[#202126]" />
              <div className="space-y-3 p-[18px]">
                <div className="h-4 w-24 rounded bg-[#292a30]" />
                <div className="h-4 w-3/4 rounded bg-[#292a30]" />
                <div className="h-3 w-1/2 rounded bg-[#292a30]" />
                <div className="h-5 rounded bg-[#202126]" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error state */}
      {!is_loading && error && (
        <p className="py-10 text-center text-sm text-red-400">{error}</p>
      )}

      {/* API workout cards */}
      {!is_loading && !error && (
        <div className="grid grid-cols-1 gap-[18px] sm:grid-cols-2 lg:grid-cols-3">
          {workouts.map((workout) => (
            <Link
              key={workout.id}
              href={`/workouts/${workout.id}`}
              className="group overflow-hidden rounded-[13px] border border-[#25272d] bg-[#15161b] transition-colors duration-200 hover:border-[#c8ff00]/50"
            >
              {/* API image */}
              <div className="relative h-[148px] overflow-hidden">
                <Image
                  src={workout.image}
                  alt={workout.name}
                  fill
                  unoptimized
                  sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw"
                  className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                />
              </div>

              {/* Card information */}
              <div className="p-[18px]">
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {workout.muscleGroups.map((group) => (
                    <span
                      key={group}
                      className="rounded-full bg-[#c8ff00] px-[9px] py-[3px] text-[9px] font-extrabold leading-none text-black"
                    >
                      {group.toUpperCase()}
                    </span>
                  ))}
                </div>

                <h3 className="truncate text-[13px] font-extrabold tracking-[-0.2px] text-white">
                  {workout.name.toUpperCase()}
                </h3>

                <p className="mt-1 truncate text-[10px] text-[#92949d]">
                  {workout.equipment}
                </p>

                {/* API stats */}
                <div className="mt-3 flex items-center gap-3 border-t border-[#25272d] pt-3 text-[10px] text-[#92949d]">
                  <span className="flex items-center gap-1">
                    <Clock3 size={11} />
                    {workout.duration} min
                  </span>

                  <span className="flex items-center gap-1">
                    <Flame size={11} fill="currentColor" />
                    {workout.caloriesBurned} kcal
                  </span>

                  <span className="flex items-center gap-1">
                    <Star size={11} />
                    {workout.rating.toFixed(1)}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {!is_loading && !error && workouts.length === 0 && (
        <p className="py-10 text-center text-sm text-[#92949d]">
          No workouts found.
        </p>
      )}
    </section>
  );
}
