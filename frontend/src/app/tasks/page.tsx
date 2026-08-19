"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  List,
  Kanban,
  Search,
  SlidersHorizontal,
  Filter,
  Plus,
  Trash2,
  Edit3,
  Calendar,
  ChevronDown,
  User,
  CheckCircle2,
  Clock,
  MessageSquare,
  CheckSquare,
  PanelLeft,
  X,
  PlusCircle,
  AlertCircle,
  Menu,
  Folder,
} from "lucide-react";
import ThemeMenu from "../components/ThemeMenu";
import Sidebar from "../components/Sidebar";

type Member = {
  id: string;
  user: {
    id: string;
    fullName: string;
    username: string;
    title?: string;
  };
};

type Subtask = {
  id: string;
  title: string;
  completed: boolean;
  priority?: string;
  dueDate?: string;
};

type Comment = {
  id: string;
  content: string;
  createdAt: string;
  user?: {
    fullName: string;
    username: string;
  };
};

type Task = {
  id: string;
  title: string;
  description?: string | null;
  priority: "URGENT" | "HIGH" | "MEDIUM" | "LOW" | "NO_PRIORITY";
  status: "TODO" | "DOING" | "COMPLETED";
  dueDate: string | null;
  projectId?: string;
  members?: Member[];
  subtasks?: Subtask[];
  comments?: Comment[];
};

const API_URL = "http://localhost:3001";

const priorityConfig = {
  URGENT: { label: "Urgent", bg: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20" },
  HIGH: { label: "High", bg: "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20" },
  MEDIUM: { label: "Medium", bg: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20" },
  LOW: { label: "Low", bg: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20" },
  NO_PRIORITY: { label: "No Priority", bg: "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 border-zinc-200 dark:border-zinc-700" },
};

export default function TasksPage() {
  const [view, setView] = useState<"list" | "board">("list");
  const [showAddTask, setShowAddTask] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [statusFilter, setStatusFilter] = useState<"ALL" | Task["status"]>("ALL");
  const [showFilter, setShowFilter] = useState(false);
  const [showFields, setShowFields] = useState(false);
  const [showSidebarMobile, setShowSidebarMobile] = useState(false);
  const [visibleFields, setVisibleFields] = useState({
    priority: true,
    members: true,
    dueDate: true,
    actions: true,
  });

  const fetchTasks = async () => {
    try {
      let response = await fetch(`${API_URL}/tasks`);
      if (!response.ok) {
        throw new Error("Failed to fetch tasks");
      }
      let data: Task[] = await response.json();

      // If no tasks exist, run seed and fetch again
      if (data.length === 0) {
        await fetch(`${API_URL}/seed`, { method: "POST" }).catch(() => {});
        const seedRes = await fetch(`${API_URL}/tasks`);
        if (seedRes.ok) {
          data = await seedRes.json();
        }
      }

      setTasks(data);
    } catch (err) {
      setError("Unable to connect to NestJS backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleStatusChange = async (taskId: string, status: Task["status"]) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });

      if (!response.ok) throw new Error("Failed to update status");

      setTasks((current) =>
        current.map((task) => (task.id === taskId ? { ...task, status } : task))
      );
    } catch (error) {
      console.error("Failed to update status:", error);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const response = await fetch(`${API_URL}/tasks/${taskId}`, { method: "DELETE" });
      if (!response.ok) throw new Error("Failed to delete task");

      setTasks((current) => current.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = statusFilter === "ALL" || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400">
        <div className="w-8 h-8 border-2 border-zinc-300 dark:border-zinc-700 border-t-accent rounded-full animate-spin mb-3" />
        <p className="text-xs font-medium">Loading tasks from backend...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 flex transition-colors">
      {/* Sidebar Desktop */}
      <aside className="hidden md:flex w-[220px] shrink-0 border-r border-zinc-200 dark:border-zinc-800 flex-col bg-zinc-50/50 dark:bg-zinc-900/30">
        <Sidebar />
      </aside>

      {/* Sidebar Mobile Drawer */}
      {showSidebarMobile && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setShowSidebarMobile(false)} />
          <aside className="relative w-[240px] bg-white dark:bg-zinc-900 h-full shadow-xl flex flex-col z-10">
            <div className="p-3 flex justify-end">
              <button onClick={() => setShowSidebarMobile(false)} className="p-1 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
                <X className="w-5 h-5" />
              </button>
            </div>
            <Sidebar />
          </aside>
        </div>
      )}

      {/* Main Content Area */}
      <section className="flex-1 min-w-0 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-16 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-4 md:px-6 gap-3 bg-white dark:bg-zinc-950 sticky top-0 z-10">
          <button
            onClick={() => setShowSidebarMobile(true)}
            className="md:hidden p-1.5 rounded-md text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-2 text-xs text-zinc-500 font-medium">
            <span className="text-zinc-400">Workspace</span>
            <span>/</span>
            <span className="text-zinc-900 dark:text-zinc-100 font-semibold">Tasks</span>
          </div>

          <div className="ml-auto flex items-center gap-2">
            {/* Search Trigger */}
            <button
              onClick={() => setShowSearch((curr) => !curr)}
              className={`p-2 border rounded-lg text-xs flex items-center justify-center transition ${
                showSearch
                  ? "border-zinc-400 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-800"
                  : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400"
              }`}
              title="Search tasks"
            >
              <Search className="w-4 h-4" />
            </button>

            {/* Fields Dropdown */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setShowFields((curr) => !curr)}
                className="px-3 py-1.5 border border-zinc-200 dark:border-zinc-800 rounded-lg text-xs font-medium flex items-center gap-1.5 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-700 dark:text-zinc-300"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>Fields</span>
              </button>

              {showFields && (
                <div className="absolute right-0 top-10 z-20 w-44 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-2 shadow-lg">
                  <p className="px-2 py-1 text-[10px] uppercase font-semibold text-zinc-400">
                    Visible Columns
                  </p>
                  {(
                    [
                      ["priority", "Priority"],
                      ["members", "Members"],
                      ["dueDate", "Due Date"],
                      ["actions", "Actions"],
                    ] as const
                  ).map(([field, label]) => (
                    <label
                      key={field}
                      className="flex items-center gap-2 px-2 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-md"
                    >
                      <input
                        type="checkbox"
                        checked={visibleFields[field]}
                        onChange={() =>
                          setVisibleFields((curr) => ({
                            ...curr,
                            [field]: !curr[field],
                          }))
                        }
                        className="rounded text-accent focus:ring-accent"
                      />
                      {label}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <button
                onClick={() => setShowFilter((curr) => !curr)}
                className={`p-2 border rounded-lg text-xs flex items-center justify-center transition ${
                  statusFilter !== "ALL"
                    ? "border-zinc-400 dark:border-zinc-600 bg-zinc-100 dark:bg-zinc-800 text-accent font-semibold"
                    : "border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-900 text-zinc-600 dark:text-zinc-400"
                }`}
                title="Filter tasks"
              >
                <Filter className="w-4 h-4" />
              </button>

              {showFilter && (
                <div className="absolute right-0 top-10 z-20 w-40 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-1.5 shadow-lg">
                  <p className="px-2.5 py-1 text-[10px] uppercase font-semibold text-zinc-400">
                    Filter Status
                  </p>
                  {(
                    [
                      ["ALL", "All Tasks"],
                      ["TODO", "To Do"],
                      ["DOING", "Doing"],
                      ["COMPLETED", "Completed"],
                    ] as const
                  ).map(([statusKey, label]) => (
                    <button
                      key={statusKey}
                      onClick={() => {
                        setStatusFilter(statusKey as any);
                        setShowFilter(false);
                      }}
                      className={`w-full rounded-md px-2.5 py-1.5 text-left text-xs font-medium transition ${
                        statusFilter === statusKey
                          ? "bg-zinc-100 dark:bg-zinc-800 text-zinc-900 dark:text-white font-semibold"
                          : "text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800/50"
                      }`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Add Task Button */}
            <button
              onClick={() => {
                setEditingTask(null);
                setShowAddTask(true);
              }}
              className="h-9 px-3.5 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold flex items-center gap-1.5 hover:bg-zinc-800 dark:hover:bg-zinc-200 transition shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span>Add Task</span>
            </button>
          </div>
        </header>

        {/* Search Bar Bar */}
        {showSearch && (
          <div className="px-4 md:px-6 pt-4">
            <div className="relative max-w-md">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-zinc-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search tasks by title or description..."
                autoFocus
                className="w-full h-9 pl-9 pr-8 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 text-xs outline-none focus:border-zinc-400 dark:focus:border-zinc-600 transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-2.5 top-2.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Content Body */}
        <div className="p-4 md:p-6 flex-1">
          {/* Section Title & View Switch */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white">
                Task Management
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                {filteredTasks.length} {filteredTasks.length === 1 ? "task" : "tasks"} total
              </p>
            </div>

            <div className="flex border border-zinc-200 dark:border-zinc-800 rounded-lg overflow-hidden bg-zinc-50 dark:bg-zinc-900 p-0.5">
              <button
                onClick={() => setView("list")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                  view === "list"
                    ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                    : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                }`}
              >
                <List className="w-3.5 h-3.5" />
                List
              </button>

              <button
                onClick={() => setView("board")}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition ${
                  view === "board"
                    ? "bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white shadow-sm"
                    : "text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200"
                }`}
              >
                <Kanban className="w-3.5 h-3.5" />
                Board
              </button>
            </div>
          </div>

          {/* Main View Render */}
          {view === "list" ? (
            <ListView
              tasks={filteredTasks}
              onAddTask={() => {
                setEditingTask(null);
                setShowAddTask(true);
              }}
              onStatusChange={handleStatusChange}
              onDeleteTask={handleDeleteTask}
              onEditTask={(task) => {
                setEditingTask(task);
                setShowAddTask(true);
              }}
              visibleFields={visibleFields}
            />
          ) : (
            <BoardView
              tasks={filteredTasks}
              onAddTask={() => {
                setEditingTask(null);
                setShowAddTask(true);
              }}
              onStatusChange={handleStatusChange}
              onDeleteTask={handleDeleteTask}
              onEditTask={(task) => {
                setEditingTask(task);
                setShowAddTask(true);
              }}
            />
          )}
        </div>
      </section>

      {/* Task Modal Drawer */}
      {showAddTask && (
        <TaskModal
          editingTask={editingTask}
          onClose={() => {
            setShowAddTask(false);
            setEditingTask(null);
          }}
          onTaskSaved={fetchTasks}
        />
      )}
    </main>
  );
}

function SidebarContent() {
  return (
    <div className="flex flex-col h-full">
      {/* User Profile */}
      <div className="h-16 border-b border-zinc-200 dark:border-zinc-800 flex items-center px-4 gap-2.5">
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-500 to-pink-500 flex items-center justify-center text-xs font-bold text-white shadow-sm">
          D
        </div>
        <div className="flex flex-col min-w-0">
          <span className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 truncate">
            Dexter
          </span>
          <span className="text-[10px] text-zinc-400 truncate">Product Designer</span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 text-zinc-400 ml-auto" />
      </div>

      {/* Navigation */}
      <div className="p-3 space-y-1">
        <div className="px-2 py-1 text-[10px] uppercase font-semibold text-zinc-400 tracking-wider">
          Workspace
        </div>

        <button className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg bg-zinc-200/60 dark:bg-zinc-800 text-xs font-semibold text-zinc-900 dark:text-white">
          <CheckSquare className="w-4 h-4 text-accent" />
          Tasks
        </button>

        <Link
          href="/projects"
          className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800/60 transition"
        >
          <Folder className="w-4 h-4" />
          Projects
        </Link>
      </div>

      {/* Theme Section */}
      <div className="mt-auto p-3 border-t border-zinc-200 dark:border-zinc-800">
        <ThemeMenu />
      </div>
    </div>
  );
}

function ListView({
  tasks,
  onAddTask,
  onStatusChange,
  onDeleteTask,
  onEditTask,
  visibleFields,
}: {
  tasks: Task[];
  onAddTask: () => void;
  onStatusChange: (taskId: string, status: Task["status"]) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  visibleFields: {
    priority: boolean;
    members: boolean;
    dueDate: boolean;
    actions: boolean;
  };
}) {
  const todoTasks = tasks.filter((t) => t.status === "TODO");
  const doingTasks = tasks.filter((t) => t.status === "DOING");
  const completedTasks = tasks.filter((t) => t.status === "COMPLETED");

  return (
    <div className="space-y-6">
      <TaskGroup
        title="To Do"
        count={todoTasks.length}
        tasks={todoTasks}
        onAddTask={onAddTask}
        onStatusChange={onStatusChange}
        onDeleteTask={onDeleteTask}
        onEditTask={onEditTask}
        visibleFields={visibleFields}
      />

      <TaskGroup
        title="Doing"
        count={doingTasks.length}
        tasks={doingTasks}
        onAddTask={onAddTask}
        onStatusChange={onStatusChange}
        onDeleteTask={onDeleteTask}
        onEditTask={onEditTask}
        visibleFields={visibleFields}
      />

      <TaskGroup
        title="Completed"
        count={completedTasks.length}
        tasks={completedTasks}
        onAddTask={onAddTask}
        onStatusChange={onStatusChange}
        onDeleteTask={onDeleteTask}
        onEditTask={onEditTask}
        visibleFields={visibleFields}
      />
    </div>
  );
}

function TaskGroup({
  title,
  count,
  tasks,
  onAddTask,
  onStatusChange,
  onDeleteTask,
  onEditTask,
  visibleFields,
}: {
  title: string;
  count: number;
  tasks: Task[];
  onAddTask: () => void;
  onStatusChange: (taskId: string, status: Task["status"]) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
  visibleFields: {
    priority: boolean;
    members: boolean;
    dueDate: boolean;
    actions: boolean;
  };
}) {
  return (
    <section className="space-y-2">
      <div className="flex items-center gap-2">
        <ChevronDown className="w-3.5 h-3.5 text-zinc-400" />
        <h2 className="text-xs font-semibold text-zinc-800 dark:text-zinc-200">
          {title}
        </h2>
        <span className="text-[11px] text-zinc-400 font-medium">({count})</span>
      </div>

      <div className="border border-zinc-200 dark:border-zinc-800/80 rounded-xl overflow-hidden bg-white dark:bg-zinc-900/50 shadow-sm">
        {/* Table Header */}
        <div
          className="hidden sm:grid bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-4 py-2 text-[10px] font-semibold text-zinc-400 uppercase tracking-wider"
          style={{
            gridTemplateColumns: `minmax(0, 1fr) ${visibleFields.priority ? "110px" : ""} ${
              visibleFields.members ? "100px" : ""
            } ${visibleFields.dueDate ? "120px" : ""} ${visibleFields.actions ? "80px" : ""}`,
          }}
        >
          <span>Task</span>
          {visibleFields.priority && <span>Priority</span>}
          {visibleFields.members && <span>Members</span>}
          {visibleFields.dueDate && <span>Due Date</span>}
          {visibleFields.actions && <span className="text-right">Actions</span>}
        </div>

        {tasks.length === 0 ? (
          <div className="px-4 py-6 text-center text-xs text-zinc-400 italic">
            No tasks in {title.toLowerCase()}
          </div>
        ) : (
          tasks.map((task) => {
            const completedSubtasks = task.subtasks?.filter((s) => s.completed).length ?? 0;
            const totalSubtasks = task.subtasks?.length ?? 0;

            return (
              <div
                key={task.id}
                className="grid gap-3 px-4 py-3 border-b last:border-b-0 border-zinc-100 dark:border-zinc-800/60 items-center hover:bg-zinc-50/80 dark:hover:bg-zinc-800/40 transition group"
                style={{
                  gridTemplateColumns: `minmax(0, 1fr) ${visibleFields.priority ? "110px" : ""} ${
                    visibleFields.members ? "100px" : ""
                  } ${visibleFields.dueDate ? "120px" : ""} ${visibleFields.actions ? "80px" : ""}`,
                }}
              >
                {/* Task Details */}
                <div className="min-w-0 pr-2">
                  <div className="flex items-center gap-2">
                    <Link
                      href={`/tasks/${task.id}`}
                      className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:text-accent truncate transition text-left"
                    >
                      {task.title}
                    </Link>

                    {totalSubtasks > 0 && (
                      <span className="shrink-0 px-1.5 py-0.5 rounded text-[9px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-500 flex items-center gap-1">
                        <CheckSquare className="w-2.5 h-2.5" />
                        {completedSubtasks}/{totalSubtasks}
                      </span>
                    )}

                    {task.comments && task.comments.length > 0 && (
                      <span className="shrink-0 px-1.5 py-0.5 rounded text-[9px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-500 flex items-center gap-1">
                        <MessageSquare className="w-2.5 h-2.5" />
                        {task.comments.length}
                      </span>
                    )}
                  </div>

                  <div className="mt-1 flex items-center gap-2">
                    <select
                      value={task.status}
                      onChange={(e) => onStatusChange(task.id, e.target.value as Task["status"])}
                      className="text-[10px] border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-900 rounded-md px-1.5 py-0.5 text-zinc-600 dark:text-zinc-400 font-medium focus:outline-none"
                    >
                      <option value="TODO">To Do</option>
                      <option value="DOING">Doing</option>
                      <option value="COMPLETED">Completed</option>
                    </select>
                  </div>
                </div>

                {/* Priority */}
                {visibleFields.priority && (
                  <div>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${
                        priorityConfig[task.priority]?.bg
                      }`}
                    >
                      {priorityConfig[task.priority]?.label}
                    </span>
                  </div>
                )}

                {/* Members */}
                {visibleFields.members && (
                  <div className="flex -space-x-1.5 overflow-hidden">
                    {task.members && task.members.length > 0 ? (
                      task.members.map((m) => (
                        <div
                          key={m.id}
                          title={m.user?.fullName}
                          className="inline-flex w-6 h-6 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-600 border border-white dark:border-zinc-900 items-center justify-center text-[9px] text-white font-bold"
                        >
                          {m.user?.fullName?.[0] ?? "U"}
                        </div>
                      ))
                    ) : (
                      <span className="text-[11px] text-zinc-400">-</span>
                    )}
                  </div>
                )}

                {/* Due Date */}
                {visibleFields.dueDate && (
                  <div className="text-[11px] text-zinc-500 dark:text-zinc-400 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-zinc-400" />
                    <span>{task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"}</span>
                  </div>
                )}

                {/* Actions */}
                {visibleFields.actions && (
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => onEditTask(task)}
                      className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition"
                      title="Edit task details"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteTask(task.id)}
                      className="p-1 text-zinc-400 hover:text-red-500 transition"
                      title="Delete task"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}

function BoardView({
  tasks,
  onAddTask,
  onStatusChange,
  onDeleteTask,
  onEditTask,
}: {
  tasks: Task[];
  onAddTask: () => void;
  onStatusChange: (taskId: string, status: Task["status"]) => void;
  onDeleteTask: (taskId: string) => void;
  onEditTask: (task: Task) => void;
}) {
  const columns = [
    { title: "To Do", status: "TODO", tasks: tasks.filter((t) => t.status === "TODO") },
    { title: "Doing", status: "DOING", tasks: tasks.filter((t) => t.status === "DOING") },
    { title: "Completed", status: "COMPLETED", tasks: tasks.filter((t) => t.status === "COMPLETED") },
  ];

  return (
    <div className="flex gap-4 overflow-x-auto pb-6 items-start">
      {columns.map((column) => (
        <div
          key={column.title}
          className="w-[280px] shrink-0 bg-zinc-50/70 dark:bg-zinc-900/40 border border-zinc-200 dark:border-zinc-800 rounded-xl p-3 flex flex-col max-h-[80vh]"
        >
          {/* Column Header */}
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <h2 className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                {column.title}
              </h2>
              <span className="px-1.5 py-0.5 rounded-full bg-zinc-200 dark:bg-zinc-800 text-[10px] font-bold text-zinc-600 dark:text-zinc-400">
                {column.tasks.length}
              </span>
            </div>

            <button
              onClick={onAddTask}
              className="p-1 rounded hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-500 transition"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Cards Container */}
          <div className="space-y-2.5 overflow-y-auto pr-0.5">
            {column.tasks.map((task) => {
              const completedSubtasks = task.subtasks?.filter((s) => s.completed).length ?? 0;
              const totalSubtasks = task.subtasks?.length ?? 0;

              return (
                <div
                  key={task.id}
                  className="border border-zinc-200 dark:border-zinc-800 rounded-xl p-3.5 bg-white dark:bg-zinc-900 shadow-sm hover:shadow-md transition space-y-2.5"
                >
                  <div className="flex items-start justify-between gap-2">
                    <Link
                      href={`/tasks/${task.id}`}
                      className="text-xs font-semibold text-zinc-900 dark:text-zinc-100 hover:text-accent text-left line-clamp-2"
                    >
                      {task.title}
                    </Link>
                  </div>

                  {task.description && (
                    <p className="text-[11px] text-zinc-500 dark:text-zinc-400 line-clamp-2">
                      {task.description}
                    </p>
                  )}

                  {/* Badges & Meta */}
                  <div className="flex flex-wrap gap-1.5 items-center">
                    <span
                      className={`inline-flex px-1.5 py-0.5 rounded text-[9px] font-semibold border ${
                        priorityConfig[task.priority]?.bg
                      }`}
                    >
                      {priorityConfig[task.priority]?.label}
                    </span>

                    {totalSubtasks > 0 && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-500 flex items-center gap-1">
                        <CheckSquare className="w-2.5 h-2.5" />
                        {completedSubtasks}/{totalSubtasks}
                      </span>
                    )}

                    {task.comments && task.comments.length > 0 && (
                      <span className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-500 flex items-center gap-1">
                        <MessageSquare className="w-2.5 h-2.5" />
                        {task.comments.length}
                      </span>
                    )}
                  </div>

                  {/* Status Dropdown */}
                  <select
                    value={task.status}
                    onChange={(e) => onStatusChange(task.id, e.target.value as Task["status"])}
                    className="w-full text-[10px] border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-950 text-zinc-600 dark:text-zinc-400 rounded-md px-2 py-1 font-medium focus:outline-none"
                  >
                    <option value="TODO">To Do</option>
                    <option value="DOING">Doing</option>
                    <option value="COMPLETED">Completed</option>
                  </select>

                  {/* Card Footer */}
                  <div className="flex items-center justify-between pt-1 border-t border-zinc-100 dark:border-zinc-800/60">
                    <div className="flex -space-x-1.5 overflow-hidden">
                      {task.members && task.members.length > 0 ? (
                        task.members.map((m) => (
                          <div
                            key={m.id}
                            title={m.user?.fullName}
                            className="inline-flex w-5 h-5 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-600 border border-white dark:border-zinc-900 items-center justify-center text-[8px] text-white font-bold"
                          >
                            {m.user?.fullName?.[0] ?? "U"}
                          </div>
                        ))
                      ) : (
                        <span className="text-[10px] text-zinc-400">Unassigned</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => onEditTask(task)}
                        className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 transition"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => onDeleteTask(task.id)}
                        className="p-1 text-zinc-400 hover:text-red-500 transition"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}

            <button
              onClick={onAddTask}
              className="w-full border border-dashed border-zinc-300 dark:border-zinc-800 hover:border-zinc-400 dark:hover:border-zinc-700 rounded-xl py-2 text-[11px] font-semibold text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 flex items-center justify-center gap-1 transition"
            >
              <Plus className="w-3.5 h-3.5" />
              Add Card
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

function TaskModal({
  editingTask,
  onClose,
  onTaskSaved,
}: {
  editingTask?: Task | null;
  onClose: () => void;
  onTaskSaved: () => void;
}) {
  const [title, setTitle] = useState(editingTask?.title ?? "");
  const [description, setDescription] = useState(editingTask?.description ?? "");
  const [priority, setPriority] = useState<Task["priority"]>(editingTask?.priority ?? "NO_PRIORITY");
  const [status, setStatus] = useState<Task["status"]>(editingTask?.status ?? "TODO");
  const [dueDate, setDueDate] = useState(
    editingTask?.dueDate ? new Date(editingTask.dueDate).toISOString().split("T")[0] : ""
  );

  const [subtasks, setSubtasks] = useState<Subtask[]>(editingTask?.subtasks ?? []);
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("");

  const [comments, setComments] = useState<Comment[]>(editingTask?.comments ?? []);
  const [newCommentContent, setNewCommentContent] = useState("");

  const [saving, setSaving] = useState(false);

  const handleSaveTask = async () => {
    if (!title.trim()) return;
    setSaving(true);

    try {
      const response = await fetch(
        editingTask ? `${API_URL}/tasks/${editingTask.id}` : `${API_URL}/tasks`,
        {
          method: editingTask ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title,
            description,
            priority,
            status,
            dueDate: dueDate ? new Date(dueDate).toISOString() : undefined,
          }),
        }
      );

      if (!response.ok) throw new Error("Failed to save task");

      onTaskSaved();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleAddSubtask = async () => {
    if (!newSubtaskTitle.trim() || !editingTask) return;
    try {
      const res = await fetch(`${API_URL}/subtasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: newSubtaskTitle,
          taskId: editingTask.id,
          completed: false,
        }),
      });
      if (res.ok) {
        const createdSubtask = await res.json();
        setSubtasks((curr) => [...curr, createdSubtask]);
        setNewSubtaskTitle("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleToggleSubtask = async (subtaskId: string, completed: boolean) => {
    try {
      setSubtasks((curr) =>
        curr.map((s) => (s.id === subtaskId ? { ...s, completed } : s))
      );

      await fetch(`${API_URL}/subtasks/${subtaskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ completed }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async () => {
    if (!newCommentContent.trim() || !editingTask) return;
    try {
      const res = await fetch(`${API_URL}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: newCommentContent,
          taskId: editingTask.id,
        }),
      });
      if (res.ok) {
        const createdComment = await res.json();
        setComments((curr) => [createdComment, ...curr]);
        setNewCommentContent("");
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/60 backdrop-blur-xs" onClick={onClose} />

      <div className="relative w-full max-w-xl bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-800 max-h-[90vh] flex flex-col overflow-hidden z-10">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
          <h2 className="text-base font-bold text-zinc-900 dark:text-white">
            {editingTask ? "Edit Task Details" : "Create New Task"}
          </h2>
          <button onClick={onClose} className="p-1 rounded-lg text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {/* Title */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Implement Guest Authentication"
              className="w-full h-10 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-3 text-xs text-zinc-900 dark:text-zinc-100 outline-none focus:border-zinc-400 dark:focus:border-zinc-600 font-medium"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-zinc-700 dark:text-zinc-300 mb-1">
              Description
            </label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add details, notes or guidelines..."
              className="w-full rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 p-3 text-xs text-zinc-900 dark:text-zinc-100 outline-none focus:border-zinc-400 dark:focus:border-zinc-600 font-medium resize-none"
            />
          </div>

          {/* Status, Priority, Due Date Controls */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-500 mb-1">
                Status
              </label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full h-9 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-2.5 text-xs text-zinc-900 dark:text-zinc-100 font-medium outline-none"
              >
                <option value="TODO">To Do</option>
                <option value="DOING">Doing</option>
                <option value="COMPLETED">Completed</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-500 mb-1">
                Priority
              </label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value as any)}
                className="w-full h-9 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-2.5 text-xs text-zinc-900 dark:text-zinc-100 font-medium outline-none"
              >
                <option value="NO_PRIORITY">No Priority</option>
                <option value="LOW">Low</option>
                <option value="MEDIUM">Medium</option>
                <option value="HIGH">High</option>
                <option value="URGENT">Urgent</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-500 mb-1">
                Due Date
              </label>
              <input
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full h-9 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-2.5 text-xs text-zinc-900 dark:text-zinc-100 font-medium outline-none"
              />
            </div>
          </div>

          {/* Subtasks Section (When Editing) */}
          {editingTask && (
            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                  <CheckSquare className="w-3.5 h-3.5 text-accent" />
                  Subtasks ({subtasks.filter((s) => s.completed).length}/{subtasks.length})
                </span>
              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {subtasks.map((st) => (
                  <label
                    key={st.id}
                    className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg border border-zinc-100 dark:border-zinc-800/80 bg-zinc-50/50 dark:bg-zinc-950/40 text-xs font-medium cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={st.completed}
                      onChange={(e) => handleToggleSubtask(st.id, e.target.checked)}
                      className="rounded text-accent focus:ring-accent"
                    />
                    <span className={st.completed ? "line-through text-zinc-400" : "text-zinc-800 dark:text-zinc-200"}>
                      {st.title}
                    </span>
                  </label>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newSubtaskTitle}
                  onChange={(e) => setNewSubtaskTitle(e.target.value)}
                  placeholder="Add a subtask item..."
                  className="flex-1 h-8 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-2.5 text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddSubtask}
                  className="px-3 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
                >
                  Add
                </button>
              </div>
            </div>
          )}

          {/* Comments Section (When Editing) */}
          {editingTask && (
            <div className="pt-3 border-t border-zinc-200 dark:border-zinc-800 space-y-2">
              <span className="text-xs font-bold text-zinc-800 dark:text-zinc-200 flex items-center gap-1.5">
                <MessageSquare className="w-3.5 h-3.5 text-accent" />
                Comments ({comments.length})
              </span>

              <div className="space-y-2 max-h-36 overflow-y-auto">
                {comments.map((c) => (
                  <div key={c.id} className="p-2.5 rounded-lg bg-zinc-50 dark:bg-zinc-950 border border-zinc-100 dark:border-zinc-800 text-xs space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-zinc-400">
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">
                        {c.user?.fullName ?? "User"}
                      </span>
                      <span>{new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p className="text-zinc-800 dark:text-zinc-200">{c.content}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-2 pt-1">
                <input
                  type="text"
                  value={newCommentContent}
                  onChange={(e) => setNewCommentContent(e.target.value)}
                  placeholder="Write a comment..."
                  className="flex-1 h-8 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 px-2.5 text-xs outline-none"
                />
                <button
                  type="button"
                  onClick={handleAddComment}
                  className="px-3 h-8 rounded-lg bg-zinc-100 dark:bg-zinc-800 text-xs font-semibold text-zinc-800 dark:text-zinc-200 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition"
                >
                  Post
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-end gap-2 bg-zinc-50/50 dark:bg-zinc-950/40">
          <button
            type="button"
            onClick={onClose}
            className="px-4 h-9 rounded-lg border border-zinc-200 dark:border-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSaveTask}
            disabled={saving}
            className="px-4 h-9 rounded-lg bg-zinc-900 dark:bg-zinc-100 text-white dark:text-zinc-900 text-xs font-semibold hover:bg-zinc-800 dark:hover:bg-zinc-200 transition disabled:opacity-50"
          >
            {saving ? "Saving..." : editingTask ? "Update Task" : "Create Task"}
          </button>
        </div>
      </div>
    </div>
  );
}