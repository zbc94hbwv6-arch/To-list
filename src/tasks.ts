export type Task = {
  id: string;
  title: string;
  completed: boolean;
};

export const STORAGE_KEY = "to-list.tasks";
export const MAX_TITLE_LENGTH = 240;

export function isTask(value: unknown): value is Task {
  if (!value || typeof value !== "object") return false;
  const task = value as Record<string, unknown>;
  return (
    typeof task.id === "string" &&
    task.id.length > 0 &&
    typeof task.title === "string" &&
    task.title.trim().length > 0 &&
    typeof task.completed === "boolean"
  );
}

export function readTasks(storage: Storage | undefined): Task[] {
  if (!storage) return [];
  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter(isTask);
  } catch {
    return [];
  }
}

export function writeTasks(storage: Storage | undefined, tasks: Task[]): void {
  if (!storage) return;
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  } catch {
    // Private mode and full storage should not break the list in memory.
  }
}

export function createTask(title: string): Task | null {
  const trimmed = title.trim().slice(0, MAX_TITLE_LENGTH);
  if (!trimmed) return null;
  return {
    id: crypto.randomUUID(),
    title: trimmed,
    completed: false,
  };
}

export function openCount(tasks: Task[]): number {
  return tasks.reduce((count, task) => count + (task.completed ? 0 : 1), 0);
}
