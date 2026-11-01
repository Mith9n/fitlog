
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Check, Clock3, Flame, Star } from "lucide-react";
import {
  COMPLETED_STORAGE_KEY,
  PLAN_STORAGE_KEY,
  read_workouts,
  SAVED_STORAGE_KEY,
  save_workouts,
  subscribe_to_workout_updates,
} from "@/lib/workouts-storage";

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

type Tab = "plan" | "saved";
type SortBy = "duration" | "calories" | "rating";

export default function MyPlanPage() {
  const [active_tab, set_active_tab] = useState<Tab>("plan");
  const [sort_by, set_sort_by] = useState<SortBy>("duration");
  const [plan, set_plan] = useState<Workout[]>([]);
  const [saved, set_saved] = useState<Workout[]>([]);
  const [completed_ids, set_completed_ids] = useState<number[]>([]);
  const [is_loading, set_is_loading] = useState(true);

  useEffect(() => {
    function sync_active_tab() {
      set_active_tab(window.location.hash === "#saved" ? "saved" : "plan");
    }

    function update_workouts() {
      set_plan(read_workouts<Workout>(PLAN_STORAGE_KEY));
      set_saved(read_workouts<Workout>(SAVED_STORAGE_KEY));
      set_completed_ids(read_workouts<number>(COMPLETED_STORAGE_KEY));
    }

    sync_active_tab();
    window.addEventListener("hashchange", sync_active_tab);
    const timeout_id = window.setTimeout(() => {
      update_workouts();
      set_is_loading(false);
    }, 0);
    const unsubscribe = subscribe_to_workout_updates(update_workouts);

    return () => {
      window.clearTimeout(timeout_id);
      window.removeEventListener("hashchange", sync_active_tab);
      unsubscribe();
    };
  }, []);

  function change_active_tab(tab: Tab) {
    set_active_tab(tab);
    window.history.replaceState(null, "", `#${tab}`);
  }

  const active_workouts =
    active_tab === "plan" ? plan : saved;

  const sorted_workouts = [...active_workouts].sort(
    (a, b) => {
      if (sort_by === "duration") return a.duration - b.duration;
      if (sort_by === "calories") {
        return b.caloriesBurned - a.caloriesBurned;
      }
      return b.rating - a.rating;
    }
  );

  const total_minutes = plan.reduce(
    (total, item) => total + item.duration,
    0
  );

  const total_calories = plan.reduce(
    (total, item) => total + item.caloriesBurned,
    0
  );

  function remove_workout(id: number) {
    if (active_tab === "plan") {
      const updated_plan = plan.filter((item) => item.id !== id);
      const updated_completed_ids = completed_ids.filter(
        (item_id) => item_id !== id
      );
      set_plan(updated_plan);
      save_workouts(PLAN_STORAGE_KEY, updated_plan);
      set_completed_ids(updated_completed_ids);
      save_workouts(COMPLETED_STORAGE_KEY, updated_completed_ids);
    } else {
      const updated_saved = saved.filter((item) => item.id !== id);
      set_saved(updated_saved);
      save_workouts(SAVED_STORAGE_KEY, updated_saved);
    }
  }

  function mark_as_done(id: number) {
    if (completed_ids.includes(id)) return;

    const updated_completed_ids = [...completed_ids, id];
    set_completed_ids(updated_completed_ids);
    save_workouts(COMPLETED_STORAGE_KEY, updated_completed_ids);
  }

  if (is_loading) {
    return (
      <main className="mx-auto min-h-[65vh] max-w-[1200px] animate-pulse px-5 py-10">
        <div className="h-8 w-40 rounded bg-[#202126]" />
        <div className="mt-8 h-20 rounded-xl bg-[#202126]" />
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-[65vh] w-[calc(100%-32px)] max-w-[1200px] py-8 sm:py-10">
      {/* Page heading */}
      <div>
        <h1 className="text-2xl font-black tracking-tight">
          MY PLAN
        </h1>
        <p className="mt-2 text-xs text-[#92949d]">
          Cap of five lifts for today. Finish them, then load more.
        </p>
      </div>

      {/* Statistics */}
      <section className="mt-6 grid grid-cols-3 divide-x divide-[#25272d] rounded-xl border border-[#25272d] bg-[#15161b] py-5">
        <div className="px-4 sm:px-6">
          <p className="text-[10px] text-[#92949d]">Exercises</p>
          <p className="mt-1 text-2xl font-black text-[#c8ff00]">
            {plan.length}
          </p>
        </div>

        <div className="px-4 sm:px-6">
          <p className="text-[10px] text-[#92949d]">Minutes</p>
          <p className="mt-1 text-2xl font-black">{total_minutes}</p>
        </div>

        <div className="px-4 sm:px-6">
          <p className="text-[10px] text-[#92949d]">Calories</p>
          <p className="mt-1 text-2xl font-black">{total_calories}</p>
        </div>
      </section>

      {/* Tabs and sorting */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
        <div className="flex rounded-lg border border-[#25272d] bg-[#15161b] p-1">
          <button
            type="button"
            onClick={() => change_active_tab("plan")}
            className={`rounded-md px-3 py-2 text-[11px] font-semibold ${
              active_tab === "plan"
                ? "bg-[#24262d] text-white"
                : "text-[#92949d] hover:text-white"
            }`}
          >
            Today&apos;s Plan
          </button>

          <button
            type="button"
            onClick={() => change_active_tab("saved")}
            className={`rounded-md px-3 py-2 text-[11px] font-semibold ${
              active_tab === "saved"
                ? "bg-[#24262d] text-white"
                : "text-[#92949d] hover:text-white"
            }`}
          >
            Saved ({saved.length})
          </button>
        </div>

        <label className="flex items-center gap-2 text-[10px] text-[#92949d]">
          Sort By
          <select
            value={sort_by}
            onChange={(event) =>
              set_sort_by(event.target.value as SortBy)
            }
            className="rounded-md border border-[#25272d] bg-[#15161b] px-2 py-2 text-xs text-white outline-none focus:border-[#c8ff00]"
          >
            <option value="duration">Duration</option>
            <option value="calories">Calories</option>
            <option value="rating">Rating</option>
          </select>
        </label>
      </div>

      {/* Workout list */}
      <section className="mt-5 space-y-3">
        {sorted_workouts.map((workout) => {
          const is_done = completed_ids.includes(workout.id);

          return (
            <article
              key={workout.id}
              className="flex flex-col gap-4 rounded-xl border border-[#25272d] bg-[#15161b] p-3 sm:flex-row sm:items-center"
            >
              {/* Thumbnail */}
              <div className="relative h-24 w-full shrink-0 overflow-hidden rounded-lg bg-[#202126] sm:h-[76px] sm:w-28">
                <Image
                  src={workout.image}
                  alt={workout.name}
                  fill
                  unoptimized
                  sizes="112px"
                  className="object-cover"
                />
              </div>

              {/* Workout information */}
              <div className="min-w-0 flex-1">
                <h2
                  className={`text-xs font-extrabold ${
                    is_done ? "text-[#92949d] line-through" : "text-white"
                  }`}
                >
                  {workout.name.toUpperCase()}
                </h2>

                <p className="mt-1 truncate text-[10px] text-[#92949d]">
                  {workout.equipment}
                </p>

                <div className="mt-2 flex flex-wrap items-center gap-3 text-[10px] text-[#92949d]">
                  <span className="flex items-center gap-1">
                    <Clock3 size={11} />
                    {workout.duration} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Flame size={11} />
                    {workout.caloriesBurned} kcal
                  </span>
                  <span className="flex items-center gap-1">
                    <Star size={11} />
                    {workout.rating.toFixed(1)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap items-center gap-2 sm:justify-end">
                <Link
                  href={`/workouts/${workout.id}`}
                  className="rounded-full border border-[#353740] px-3 py-2 text-[10px] text-white transition-colors hover:border-[#c8ff00]"
                >
                  View Details
                </Link>

                {active_tab === "plan" && (
                  <button
                    type="button"
                    onClick={() => mark_as_done(workout.id)}
                    disabled={is_done}
                    className="inline-flex items-center gap-1 rounded-full bg-[#c8ff00] px-3 py-2 text-[10px] font-bold text-black disabled:opacity-60"
                  >
                    <Check size={11} />
                    {is_done ? "Done" : "Mark as Done"}
                  </button>
                )}

                <button
                  type="button"
                  onClick={() => remove_workout(workout.id)}
                  aria-label={`Remove ${workout.name}`}
                  className="px-1 text-sm text-[#92949d] transition-colors hover:text-red-400"
                >
                  ×
                </button>
              </div>
            </article>
          );
        })}

        {/* Empty state */}
        {sorted_workouts.length === 0 && (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-[#25272d] bg-[#15161b] px-5 text-center">
            <h2 className="text-xl font-black">NOTHING HERE YET</h2>

            <p className="mt-2 text-xs text-[#92949d]">
              {active_tab === "plan"
                ? "Add workouts to build today's plan."
                : "Save workouts to find them here later."}
            </p>

            <Link
              href="/#library"
              className="mt-5 rounded-md bg-[#c8ff00] px-5 py-3 text-xs font-bold text-black"
            >
              Go to workouts
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
