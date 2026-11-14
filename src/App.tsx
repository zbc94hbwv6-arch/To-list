import { useEffect, useId, useState, type FormEvent } from "react";
import {
  createTask,
  openCount,
  readTasks,
  writeTasks,
  type Task,
} from "./tasks";

export default function App() {
  const inputId = useId();
  const [tasks, setTasks] = useState<Task[]>(() => readTasks(localStorage));
  const [draft, setDraft] = useState("");

  useEffect(() => {
    writeTasks(localStorage, tasks);
  }, [tasks]);

  const remaining = openCount(tasks);
  const trimmed = draft.trim();

  function addTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const task = createTask(draft);
    if (!task) return;
    setTasks((current) => [...current, task]);
    setDraft("");
  }

  function toggleTask(id: string) {
    setTasks((current) =>
      current.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task,
      ),
    );
  }

  function deleteTask(id: string) {
    setTasks((current) => current.filter((task) => task.id !== id));
  }

  const summary =
    tasks.length === 0
      ? "Nothing on the list"
      : remaining === 0
        ? "All caught up"
        : remaining === 1
          ? "1 task left"
          : `${remaining} tasks left`;

  return (
    <main className="page">
      <header className="masthead">
        <p className="eyebrow">Today</p>
        <h1>To-do</h1>
        <p className="lede">Add a task, check it off, or let it go.</p>
      </header>

      <form className="composer" onSubmit={addTask}>
        <label className="sr-only" htmlFor={inputId}>
          New task
        </label>
        <input
          id={inputId}
          name="task"
          type="text"
          value={draft}
          maxLength={240}
          autoComplete="off"
          placeholder="Add a task"
          onChange={(event) => setDraft(event.target.value)}
        />
        <button type="submit" disabled={!trimmed}>
          Add
        </button>
      </form>

      <p className="summary" aria-live="polite">
        {summary}
      </p>

      {tasks.length === 0 ? (
        <p className="empty">Your list is clear. Write the next thing down.</p>
      ) : (
        <ul className="list">
          {tasks.map((task) => (
            <li key={task.id} className={task.completed ? "done" : undefined}>
              <label>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleTask(task.id)}
                />
                <span className="mark" aria-hidden="true">
                  <svg viewBox="0 0 16 16">
                    <path
                      d="M3.2 8.3 6.4 11.4 12.8 4.6"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.7"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <span className="title">{task.title}</span>
              </label>
              <button
                type="button"
                className="delete"
                aria-label={`Delete ${task.title}`}
                onClick={() => deleteTask(task.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
