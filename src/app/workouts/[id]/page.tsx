
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Bookmark, Check, ClipboardList } from "lucide-react";
import { toast } from "react-toastify";
import {
  PLAN_STORAGE_KEY,
  read_workouts,
  SAVED_STORAGE_KEY,
  save_workouts,
} from "@/lib/workouts-storage";

const ALL_WORKOUTS_API =
  "https://api.abcz.workers.dev/api/fitlog";

type Workout = {
  id: number;
  name: string;
  image: string;
  muscleGroups: string[];
  equipment: string;
  difficulty: string;
  duration: number;
  caloriesBurned: number;
  sets: number;
  reps: string;
  rating: number;
  description: string;
  instructions: string[];
};

export default function WorkoutDetailsPage() {
  const params = useParams<{ id: string }>();

  const [workout, set_workout] = useState<Workout | null>(null);
  const [is_loading, set_is_loading] = useState(true);
  const [error, set_error] = useState("");
  const [is_in_plan, set_is_in_plan] = useState(false);
  const [is_saved, set_is_saved] = useState(false);

  useEffect(() => {
    let is_active = true;

    async function fetch_workout() {
      try {
        set_is_loading(true);
        set_error("");

        // Fetch all workouts using the working API.
        const response = await fetch(ALL_WORKOUTS_API);

        if (!response.ok) {
          throw new Error("Failed to fetch workouts");
        }

        const workouts: Workout[] = await response.json();

        // Find the workout that matches the URL ID.
        const selected_workout = workouts.find(
          (item) => item.id === Number(params.id)
        );

        if (!selected_workout) {
          throw new Error("Workout not found");
        }

        if (!is_active) return;

        set_workout(selected_workout);

        // Check saved and planned status in localStorage.
        const plan = read_workouts<Workout>(PLAN_STORAGE_KEY);
        const saved = read_workouts<Workout>(SAVED_STORAGE_KEY);

        set_is_in_plan(
          plan.some((item) => item.id === selected_workout.id)
        );

        set_is_saved(
          saved.some((item) => item.id === selected_workout.id)
        );
      } catch {
        if (is_active) {
          set_error("Unable to load this workout. Please try again.");
        }
      } finally {
        if (is_active) {
          set_is_loading(false);
        }
      }
    }

    fetch_workout();

    return () => {
      is_active = false;
    };
  }, [params.id]);

  function add_to_plan() {
    if (!workout) return;

    const plan = read_workouts<Workout>(PLAN_STORAGE_KEY);

    if (plan.some((item) => item.id === workout.id)) {
      toast.info("Workout is already in your plan.");
      return;
    }

    // Allow a maximum of five workouts.
    if (plan.length >= 5) {
      toast.warning("Your plan is full. Remove a workout first.");
      return;
    }

    save_workouts(PLAN_STORAGE_KEY, [...plan, workout]);

    set_is_in_plan(true);
    toast.success("Workout added to today's plan!");
  }

  function toggle_saved() {
    if (!workout) return;

    const saved = read_workouts<Workout>(SAVED_STORAGE_KEY);

    const already_saved = saved.some(
      (item) => item.id === workout.id
    );

    const updated_saved = already_saved
      ? saved.filter((item) => item.id !== workout.id)
      : [...saved, workout];

    save_workouts(SAVED_STORAGE_KEY, updated_saved);

    set_is_saved(!already_saved);
    if (already_saved) {
      toast.info("Removed from saved workouts.");
    } else {
      toast.success("Workout saved for later!");
    }
  }

  // Loading state
  if (is_loading) {
    return (
      <main className="mx-auto min-h-[70vh] w-[calc(100%-32px)] max-w-[1200px] py-10">
        <div className="grid animate-pulse grid-cols-1 gap-7 md:grid-cols-2">
          <div className="h-[400px] rounded-lg bg-[#202126]" />

          <div className="space-y-5">
            <div className="h-8 w-3/4 rounded bg-[#202126]" />
            <div className="h-4 w-full rounded bg-[#202126]" />
            <div className="h-48 rounded-xl bg-[#202126]" />
          </div>
        </div>
      </main>
    );
  }

  // Error state
  if (error || !workout) {
    return (
      <main className="flex min-h-[70vh] flex-col items-center justify-center gap-4 px-5 text-center">
        <h1 className="text-2xl font-black">
          WORKOUT NOT FOUND
        </h1>

        <p className="text-sm text-neutral-400">{error}</p>

        <Link
          href="/"
          className="rounded-md bg-[#c8ff00] px-5 py-3 text-sm font-bold text-black"
        >
          Back to workouts
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto min-h-[70vh] w-[calc(100%-32px)] max-w-[1200px] py-8 sm:py-10">
      <div className="grid grid-cols-1 items-start gap-7 md:grid-cols-2 md:gap-10">

        {/* Left: Workout image */}
        <div className="relative h-[340px] overflow-hidden rounded-lg border border-[#25272d] bg-[#15161b] sm:h-[440px] md:h-[560px]">
          <Image
            src={workout.image}
            alt={workout.name}
            fill
            unoptimized
            priority
            sizes="(max-width: 767px) 100vw, 50vw"
            className="object-cover"
          />
        </div>

        {/* Right: Workout information */}
        <div className="min-w-0">
          <h1 className="text-2xl font-black leading-tight tracking-[-0.8px] text-white sm:text-3xl">
            {workout.name.toUpperCase()}
          </h1>

          <p className="mt-3 text-sm leading-relaxed text-[#92949d]">
            {workout.description}
          </p>

          {/* Muscle groups */}
          <div className="mt-4 flex flex-wrap gap-2">
            {workout.muscleGroups.map((group) => (
              <span
                key={group}
                className="rounded-full bg-[#c8ff00] px-3 py-1 text-[10px] font-extrabold text-black"
              >
                {group}
              </span>
            ))}
          </div>

          {/* Workout specifications */}
          <div className="mt-5 overflow-hidden rounded-xl border border-[#25272d] bg-[#15161b]">
            {[
              ["EQUIPMENT", workout.equipment],
              ["DIFFICULTY", workout.difficulty],
              ["SETS", String(workout.sets)],
              ["REPS", workout.reps],
              ["DURATION", `${workout.duration} min`],
              ["CALORIES", `${workout.caloriesBurned} kcal`],
              ["RATING", workout.rating.toFixed(1)],
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex min-h-[38px] items-center justify-between gap-4 border-b border-[#25272d] px-4 py-2 last:border-b-0"
              >
                <span className="text-[10px] font-medium tracking-wide text-[#92949d]">
                  {label}
                </span>

                <span className="text-right text-xs text-white">
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Workout instructions */}
          <section className="mt-6">
            <h2 className="text-sm font-black tracking-wide text-white">
              INSTRUCTIONS
            </h2>

            <ol className="mt-3 list-decimal space-y-2 pl-4 text-xs leading-relaxed text-[#a1a1aa]">
              {workout.instructions.map((instruction, index) => (
                <li key={`${index}-${instruction}`}>
                  {instruction}
                </li>
              ))}
            </ol>
          </section>

          {/* Action buttons */}
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={add_to_plan}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md bg-[#c8ff00] px-4 py-2 text-xs font-bold text-black transition-colors hover:bg-[#d9ff55]"
            >
              {is_in_plan ? (
                <Check size={14} />
              ) : (
                <ClipboardList size={14} />
              )}

              {is_in_plan
                ? "Added to today's plan"
                : "Add to today's plan"}
            </button>

            <button
              type="button"
              onClick={toggle_saved}
              className="inline-flex min-h-10 items-center justify-center gap-2 rounded-md border border-[#353740] px-4 py-2 text-xs font-medium text-white transition-colors hover:border-[#c8ff00]"
            >
              {is_saved ? (
                <Check size={14} />
              ) : (
                <Bookmark size={14} />
              )}

              {is_saved ? "Saved for later" : "Save for later"}
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
