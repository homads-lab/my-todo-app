'use client';

import { useState, useRef, useEffect } from 'react';

type Task = {
  id: number;
  title: string;
  completed: boolean;
  createdAt: string;
};

export default function App() {
  const inputRef = useRef<HTMLInputElement>(null);
  const editInputRef = useRef<HTMLInputElement>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editTaskId, setEditTaskId] = useState<number | null>(null);

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const res = await fetch('/api/todos');
        const data = await res.json();
        setTasks(data);
      } catch (err) {
        console.error('取得エラー:', err);
      }
    };
    fetchTodos();
  }, []);

  async function addTask(title: string) {
    const res = await fetch('/api/todos', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title }),
    });
    const newTask = await res.json();
    setTasks((prev) => [newTask, ...prev]);
  }

  async function removeTask(id: number) {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'DELETE',
    });

    if (res.ok) {
      setTasks((prev) => prev.filter((task) => task.id !== id));
    } else {
      console.error('削除に失敗しました');
    }
  }

  function startEdit(task: Task) {
    setEditTaskId(task.id);
    setTimeout(() => {
      if (editInputRef.current) {
        editInputRef.current.value = task.title;
      }
    }, 0);
  }

  async function updateTaskTitle(id: number) {
    const newTitle = editInputRef.current?.value?.trim();
    if (!newTitle) return;

    const res = await fetch(`/api/todos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: newTitle }),
    });

    if (res.ok) {
      const updated = await res.json();
      setTasks((prev) =>
        prev.map((task) => (task.id === id ? updated : task))
      );
      setEditTaskId(null);
    } else {
      console.error('更新に失敗しました');
    }
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
                <button
                  onClick={() => updateTaskTitle(task.id)}
                  className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                >
                  保存
                </button>
                <button
                  onClick={() => setEditTaskId(null)}
                  className="bg-gray-300 text-gray-800 px-3 py-1 rounded hover:bg-gray-400"
                >
                  キャンセル
                </button>
              </div>
            ) : (
              <div className="flex justify-between items-center">
                <span className="text-gray-800">{task.title}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => removeTask(task.id)}
                    className="text-red-600 hover:underline"
                  >
                    削除
                  </button>
                  <button
                    onClick={() => startEdit(task)}
                    className="text-blue-600 hover:underline"
                  >
                    編集
                  </button>
                </div>
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
              inputRef.current!.value = '';
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