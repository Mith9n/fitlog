export const PLAN_STORAGE_KEY = "fitlog_plan";
export const SAVED_STORAGE_KEY = "fitlog_saved";
export const COMPLETED_STORAGE_KEY = "fitlog_completed";

const WORKOUTS_UPDATED_EVENT = "fitlog:workouts-updated";

export function read_workouts<T>(key: string): T[] {
  try {
    const data = localStorage.getItem(key);
    return data ? (JSON.parse(data) as T[]) : [];
  } catch {
    return [];
  }
}

export function save_workouts<T>(key: string, workouts: T[]) {
  localStorage.setItem(key, JSON.stringify(workouts));
  window.dispatchEvent(new Event(WORKOUTS_UPDATED_EVENT));
}

export function subscribe_to_workout_updates(callback: () => void) {
  window.addEventListener(WORKOUTS_UPDATED_EVENT, callback);
  window.addEventListener("storage", callback);

  return () => {
    window.removeEventListener(WORKOUTS_UPDATED_EVENT, callback);
    window.removeEventListener("storage", callback);
  };
}
