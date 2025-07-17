'use client';

import { useState, useRef } from "react";
import { useImmer } from "use-immer";

type Task = {
  id: number;
  title: string;
};

export default function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [tasks, setTasks] = useImmer<Task[]>([
    { id: 1, title: "掃除をする" },
    { id: 2, title: "洗濯をする" },
  ]);
  const [editTaskId, setEditTaskId] = useState<number | null>(null);
  const editInputRef = useRef<HTMLInputElement>(null);


  function addTask(title: string) {
    setTasks((draft) => {
      draft.push({ id: draft.length + 1, title });
    });
  }

  function removeTask(id: number) {
    setTasks((draft) => {
      const index = draft.findIndex((task) => task.id === id);
      if (index !== -1) draft.splice(index, 1);
    });
  }

  function startEdit(task: Task) {
    setEditTaskId(task.id);
    setTimeout(() => {
      if (editInputRef.current) {
        editInputRef.current.value = task.title;
      }
    }, 0);
  }

  function updateTaskTitle(id: number) {
    const newTitle = editInputRef.current?.value?.trim();
    if (!newTitle) return;

    setTasks((draft) => {
    const task = draft.find((t) => t.id === id);
    if (task) {
      task.title = newTitle;
    }});
    setEditTaskId(null);
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white shadow-md rounded-md">
      <h2 className="text-xl font-bold mb-4 text-center text-blue-700">
        タスクリスト
      </h2>
      <ul className="space-y-3 mb-6">
        {tasks.map((task) => (
          <li key={task.id} className="bg-gray-100 rounded p-3">
            {editTaskId === task.id ? (
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  type="text"
                  defaultValue={task.title}
                  ref={editInputRef}
                  className="flex-1 border p-2 rounded"
                />
                <button onClick={() => updateTaskTitle(task.id)} className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">保存</button>
                <button onClick={() => setEditTaskId(null)} className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400">キャンセル</button>
              </div>
              ) : (
                <div className="flex justify-between items-center">
                  <span className="text-gray-800">{task.title}</span>
                  <button onClick={() => removeTask(task.id)} className="text-red-600 hover:underline">削除</button>
                  <button onClick={() => startEdit(task)} className="text-blue-600 hover:underline">編集</button>
                </div>
            )}
          </li>
        ))}
      </ul>
      <div className="flex gap-2">
        <input
          ref={inputRef}
          aria-label="タスクを追加するテキストフィールド"
          placeholder="タスクを追加してください"
          type="text"
          className="flex-1 border p-2 rounded"
        />
        <button
          onClick={() => {
          const value = inputRef.current?.value;
          if (value) {
            addTask(value);
            inputRef.current!.value = "";
          }
          }}
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
        >
          追加
        </button>
      </div>
    </div>
  );
}